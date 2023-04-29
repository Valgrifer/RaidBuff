import {styleReset} from "./pseudoStyles.js";
import {ActionElementState} from "./action.js";
import {getAllActionElement, REGISTRIES} from "./registry.js";
import {idToJob, Jobs, nameToId} from "./utils.js";

/**
 * Type représentant un joueur.
 * @typedef {Object} Player
 * @property {number|undefined} id - L'id' du joueur.
 * @property {string} name - Le nom du joueur.
 * @property {Job} job - L'objet représentant le job du joueur.
 * @property {number} level - Le niveau du joueur.
 */

/** @type {Player[]} */
let party = [];
/** @type {Player} */
let self = {name: "", job: Jobs.NONE, level: 0};

/**
 * Fonction de mise à jour principale.
 * Si doReset est vrai, appelle la fonction RESET(), sinon appelle la fonction UPDATE().
 */
const UPDATE = () => {
    if(doReset)
    {
        RESET();
        return;
    }
    Object.values(REGISTRIES).forEach(registry => registry.update());
};

/**
 * Indicateur pour réinitialiser l'état.
 * Lorsqu'il est défini sur vrai, la fonction RESET() sera appelée au prochain cycle de mise à jour.
 * Utilisé pour réinitialiser l'état des éléments d'action.
 */
let doReset = false;
const reset = () => {
    doReset = true;
};

/**
 * Réinitialise l'état des éléments d'action et les styles.
 */
const RESET = () => {
    doReset = false;

    getAllActionElement().forEach((e) => e.remove());

    styleReset();

    party.forEach(player =>
        Object.values(REGISTRIES).forEach(registry =>
            registry.getActions()
                .filter(ac => ac.getActionJobLevel().job.id === player.job?.id && ac.getActionJobLevel().lvl <= player.level)
                .forEach(ac => ac.setState(nameToId(player.name), ActionElementState.Up))))
};


/**
 * Retourne un tableau contenant uniquement le personnage actuel.
 *
 * @returns {Player[]} - Tableau contenant le personnage actuel.
 */
const solo = () => {
    return [self];
}




/**
 * Événement déclenché lors de la mise à jour de l'état de l'overlay.
 * Ajoute ou supprime la classe "unlocked" du corps du document en fonction de l'état de verrouillage.
 *
 * @event onOverlayStateUpdate
 * @param {Object} data - Les données fournies lors de l'événement.
 * @param {boolean} data.detail.isLocked - Si l'overlay est bloqué ou pas
 */
document.addEventListener("onOverlayStateUpdate", (data) => {
    let bodyClassList = document.querySelector("body").classList;
    // noinspection JSUnresolvedReference
    if(data.detail.isLocked)
        bodyClassList.remove("unlocked");
    else
        bodyClassList.add("unlocked");
});

/**
 * Événement déclenché lorsqu'une ligne de log est ajoutée.
 * Gère les lignes de log liées aux actions et à la mise à jour les éléments d'action correspondants.
 *
 * @event LogLine
 * @param {Object} data - Les données fournies lors de l'événement.
 * @param {string[]} data.line - Donnée split de la line de donnée
 */
addOverlayListener('LogLine', (data) => {
    if(data.line[0] === "21" || data.line[0] === "22")
    {
        const player = party.find(player => player.id === data.line[2]);
        console.log(player, party, data);

        if(!player)
            return;

        Object.values(REGISTRIES).forEach(registry =>
            registry.getActions()
                .filter(ac => ac.getID().exec(data.line[4]))
                .forEach(ac => ac.setState(nameToId(player.name), ActionElementState.Active, data)))
    }
    else if(data.line[0] === "03")
    {
        if(party.length <= 1)
        {
            if(data.line[3] !== self.name)
                return;

            self.id = data.line[2];
            self.job = idToJob(parseInt(data.line[4], 16));
            self.level = parseInt(data.line[5], 16);
            party = solo();
            reset();
        }
        else
        {
            const player = party.find(player => player.id === data.line[3]);

            if(!player)
                return;

            player.job = idToJob(parseInt(data.line[4], 16));
            player.level = parseInt(data.line[5], 16);
            reset();
        }
    }
    else if(data.line[0] === "33" && (data.line[3].substring(6) === "0F" ||  data.line[3].substring(6) === "03"))
        reset();
});

/**
 * Événement déclenché lors du changement de zone.
 * Réinitialise l'état des éléments d'action.
 *
 * @event ChangeZone
 */
addOverlayListener("ChangeZone", reset);

/**
 * Événement déclenché lors du changement du joueur principal.
 * Met à jour le nom, la classe et le niveau du personnage actuel en fonction des informations fournies.
 * Si le groupe ne contient qu'un seul joueur, appelle la fonction `solo()` pour mettre à jour le groupe.
 *
 * @event ChangePrimaryPlayer
 * @param {Object} data - Les données fournies lors de l'événement.
 * @param {string} data.charName - Le nom du joueur principal.
 * @param {Player[]} data.combatants - Liste des combatants
 * @function
 */
addOverlayListener("ChangePrimaryPlayer", (data) => {
    self.name = data.charName;
    callOverlayHandler({ call: 'getCombatants' }).then(value => {
        const player = value.combatants.find(player => player.Name === self.name);

        if(!player)
            return;

        // noinspection JSUnresolvedReference
        self.job = idToJob(player.Job);
        // noinspection JSUnresolvedReference
        self.level = player.Level;

        if(party.length <= 1)
        {
            party = solo();
            reset();
        }
    });
});

addOverlayListener("PartyChanged", (data) => {
    // noinspection JSUnresolvedReference
    party = data.party.length > 0 ? data.party.map(player => ({...player, job: idToJob(player.Job)})) : solo();
    reset();
});

(await import('./setup.js')).run();

startOverlayEvents();

frameUpdate(UPDATE);