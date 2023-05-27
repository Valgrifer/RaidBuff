/**
 * Type représentant un joueur.
 * @typedef {Object} Player
 * @property {number} id - L'id du joueur.
 * @property {string} name - Le nom du joueur.
 * @property {Job} job - L'objet représentant le job du joueur.
 * @property {number} level - Le niveau du joueur.
 * @property {boolean} inparty - Le joueur dans l'alliance ou la party.
 */

import {idToJob, Jobs, transformKeysToLowerCase} from "./utils.js";
import {reset} from "./script.js";

/** @type {Player[]} */
export let party = [];
/** @type {Player} */
export let self = { id: 0, name: "", job: Jobs.NONE, level: 0, inparty: true };

/**
 * Retourne un tableau contenant uniquement le personnage actuel.
 *
 * @returns {Player[]} - Tableau contenant le personnage actuel.
 */
export const solo = () => {
    return [self];
};


/**
 * Met à jour le joueur dans la party ou remplace la variable self.
 *
 * @param {Player} newPlayer - Le joueur mis à jour.
 * @return {boolean} something update
 */
export function updatePlayer(newPlayer) {
    const index = party.findIndex(player => player.name === newPlayer.name);

    if (party.length === 1) {
        self = newPlayer;
        party = solo();
        return true;
    } else if (index !== -1) {
        if (self.name === newPlayer.name)
            self = newPlayer;
        party.splice(index, 1, newPlayer);
        return true;
    }
    return false;
}



/**
 * Analyse et transforme les données d'un joueur.
 *
 * @param {Object} data - Les données du joueur à analyser.
 * @property {number|string} id - L'ID du joueur.
 * @property {string} name - Le nom du joueur.
 * @property {number} job - L'ID du job du joueur.
 * @property {number} level - Le niveau du joueur.
 * @returns {Player} - L'objet joueur analysé.
 */
export function playerParser(data) {
    data = transformKeysToLowerCase(data);

    if(typeof data.id === "string")
        data.id = parseInt(data.id, 16);
    if(typeof data.job === "number")
        data.job = idToJob(data.job);

    const joueurFiltre = {};
    joueurFiltre.id = data.id || null;
    joueurFiltre.name = data.name || '';
    joueurFiltre.job = data.job || null;
    joueurFiltre.level = data.level || 0;
    joueurFiltre.inparty = data.inparty || false;

    return joueurFiltre;
}

/**
 * Événement déclenché lors du changement du joueur principal.
 * Met à jour le nom, la classe et le niveau du personnage actuel en fonction des informations fournies.
 * Si le groupe ne contient qu'un seul joueur, appelle la fonction `solo()` pour mettre à jour le groupe.
 *
 * @event ChangePrimaryPlayer
 * @param {Object} data - Les données fournies lors de l'événement.
 * @param {string} data.charName - Le nom du joueur principal.
 * @param {Player[]} data.combatants - Liste des combattants
 * @function
 */
addOverlayListener("ChangePrimaryPlayer", (data) => {
    self.name = data.charName;
    callOverlayHandler({ call: 'getCombatants' }).then((value) => {
        const player = value.combatants.find((player) => player.Name === self.name);

        if (!player) return;

        updatePlayer(playerParser({...player, inparty: true}));
        reset();
    });
});

addOverlayListener("PartyChanged", (data) => {
    // noinspection JSUnresolvedReference
    party = data.party.length > 0 ? data.party.map((player) => playerParser(player)) : solo();
    reset();
});
