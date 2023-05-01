const msg = new SpeechSynthesisUtterance();
msg.voice = window.speechSynthesis.getVoices().find(el => el.default);

/**
 * @param {string} text
 */
export function TTS(text) {
    msg.text = text;
    window.speechSynthesis.speak(msg);
}

/**
 * @type {Object.<string, number>}
 */
let ttsTimeouts = {};

/**
 * Enfile un TTS (Text-to-Speech) à exécuter après un certain délai.
 * @param {string} id - L'identifiant du TTS.
 * @param {string} text - Le texte a synthétisé en parole.
 * @param {number} delay - Le délai en secondes avant l'exécution du TTS.
 */
export function enqueueTTS(id, text, delay) {
    if (id in ttsTimeouts) {
        clearTimeout(ttsTimeouts[id]);
        delete ttsTimeouts[id];
    }

    ttsTimeouts[id] = setTimeout(() => {
        TTS(text);
        delete ttsTimeouts[id];
    }, delay * 1000);
}

/**
 * Annule un TTS en attente spécifié par son identifiant.
 * @param {string} id - L'identifiant du TTS à annuler.
 */
export function cancelTTS(id) {
    if (id in ttsTimeouts) {
        clearTimeout(ttsTimeouts[id]);
        delete ttsTimeouts[id];
    }
}

/**
 * Annule tous les TTS en attente.
 */
export function cancelAllTTS() {
    Object.values(ttsTimeouts).forEach(timeoutId => clearTimeout(timeoutId));
    ttsTimeouts = {};
}

window.myTTS = {
    TTS,
    enqueueTTS,
    cancelTTS,
    cancelAllTTS
};