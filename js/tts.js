const msg = new SpeechSynthesisUtterance();
msg.voice = window.speechSynthesis.getVoices().find(el => el.default);

/**
 * @param {string} text
 * @constructor
 */
export function TTS(text) {
    msg.text = text;
    window.speechSynthesis.speak(msg);
}