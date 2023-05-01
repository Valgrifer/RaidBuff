/**
 * Type représentant un joueur.
 * @typedef {Object} Player
 * @property {number} id - L'id du joueur.
 * @property {string} name - Le nom du joueur.
 * @property {Job} job - L'objet représentant le job du joueur.
 * @property {number} level - Le niveau du joueur.
 */

import {idToJob, Jobs, transformKeysToLowerCase} from "./utils.js";
import {reset} from "./script.js";

/** @type {Player[]} */
export let party = [];
/** @type {Player} */
export let self = { id: 0, name: "", job: Jobs.NONE, level: 0 };

/**
 * Retourne un tableau contenant uniquement le personnage actuel.
 *
 * @returns {Player[]} - Tableau contenant le personnage actuel.
 */
export const solo = () => {
    return [self];
};



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

    return data;
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

        self = playerParser(player);

        if (party.length <= 1) {
            party = solo();
            reset();
        }
    });
});

addOverlayListener("PartyChanged", (data) => {
    // noinspection JSUnresolvedReference
    party = data.party.length > 0 ? data.party.map((player) => playerParser(player)) : solo();
    reset();
});
