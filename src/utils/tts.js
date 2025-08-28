export function ttsSupported() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function getVoices() {
  return window.speechSynthesis?.getVoices?.() || [];
}

export function speakText(text, opts = {}) {
  if (!ttsSupported() || !text?.trim()) return;
  const { voice, rate = 1, pitch = 1, volume = 1, onend } = opts;
  const utter = new SpeechSynthesisUtterance(text);
  if (voice) utter.voice = voice;
  utter.rate = rate;
  utter.pitch = pitch;
  utter.volume = volume;
  utter.onend = onend || null;
  // Cancel any in-progress
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export function cancelSpeech() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}
