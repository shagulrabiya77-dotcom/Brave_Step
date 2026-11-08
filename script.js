const $ = (id) => document.getElementById(id);
const progressLine = $("progressLine");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressLine.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
});

const menuToggle = $("menuToggle");
const nav = $("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

let toastTimer;
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

// English-only browser voice guidance. Actual voices depend on the device/browser.
function speak(text) {
  if (!("speechSynthesis" in window)) {
    toast("Voice guidance is not supported by this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en"));
  if (englishVoice) utterance.voice = englishVoice;
  window.speechSynthesis.speak(utterance);
}
$("voiceTop").addEventListener("click", () => speak("Welcome to Brave Step 2.0. This website presents an assistive technology concept for mobility, accessible communication and emergency support."));
$("readIntro").addEventListener("click", () => speak("Brave Step 2.0 explores how affordable electronics and a simple mobile interface can work together to support safer mobility, clearer communication and faster access to trusted help. This is a prototype-stage concept that requires testing and feedback from users."));

const waterRange = $("waterRange");
function updateWater() {
  const value = Number(waterRange.value);
  $("waterValue").textContent = `${value}%`;
  $("waterMeter").style.width = `${value}%`;
  let message = "Low sample reading";
  if (value >= 70) message = "High sample reading — alert threshold reached";
  else if (value >= 40) message = "Medium sample reading — monitor";
  $("waterStatus").textContent = `Status: ${message}`;
  $("consoleLog").textContent = `[SIMULATION] Water sensor sample updated to ${value}%. ${message}.`;
}
waterRange.addEventListener("input", updateWater);
$("obstacleSelect").addEventListener("change", (event) => {
  const value = event.target.value;
  const messages = {
    clear: "No obstacle alert in this sample",
    near: "Nearby object sample — caution alert concept",
    close: "Very close object sample — strong alert concept"
  };
  $("obstacleStatus").textContent = `Status: ${messages[value]}`;
  $("consoleLog").textContent = `[SIMULATION] Obstacle input: ${value}. ${messages[value]}.`;
});
$("sosDemo").addEventListener("click", () => {
  $("sosStatus").textContent = "Demo only: confirmation would be required before contacting a trusted person.";
  $("consoleLog").textContent = "[DEMO] SOS preview opened. No message sent. No location accessed. No call placed.";
  toast("Demo only — no real SOS was sent.");
});
