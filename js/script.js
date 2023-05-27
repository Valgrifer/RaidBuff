import {styleReset} from "./pseudoStyles.js";
import {ActionElementState} from "./action/action.js";
import {REGISTRIES} from "./registry.js";
import {nameToId} from "./utils.js";
import {cancelAllTTS} from "./tts.js";
import {self, party, playerParser, updatePlayer} from "./playerParty.js";

const MainContainer = document.querySelector(".container#main");

/**
 * Fonction de mise à jour principale.
 * Si doReset est vrai, appelle la fonction RESET(), sinon appelle la fonction UPDATE().
 */
const UPDATE = () => {
    if(doReset)
    {
        /**
         * Réinitialise l'état des éléments d'action et les styles.
         */
        doReset = false;

        cancelAllTTS();

        Object.values(REGISTRIES).forEach(registry => registry.getActions().forEach(ac => ac.reset()));

        styleReset();

        party.forEach(player =>
            Object.values(REGISTRIES).forEach(registry =>
                registry.getActions()
                    .filter(ac => ac.getActionJobLevel().job.id === player.job?.id && ac.getActionJobLevel().lvl <= player.level)
                    .forEach(ac => ac.setState(nameToId(player.name), ActionElementState.Up))))
        return;
    }

    Object.values(REGISTRIES)
        .forEach(registry => registry.update());

    // Vérification de la hauteur
    if (MainContainer.clientHeight > window.innerHeight)
        document.body.classList.add('has-overflow-height');
    else
        document.body.classList.remove('has-overflow-height');

    // Vérification de la largeur
    if (MainContainer.clientWidth > window.innerWidth)
        document.body.classList.add('has-overflow-width');
    else
        document.body.classList.remove('has-overflow-width');
};

/**
 * Indicateur pour réinitialiser l'état.
 * Lorsqu'il est défini sur vrai, la fonction RESET() sera appelée au prochain cycle de mise à jour.
 * Utilisé pour réinitialiser l'état des éléments d'action.
 */
let doReset = false;
export function reset(){
    doReset = true;
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
 * @param {LogLine} data - Les données fournies lors de l'événement.
 */
addOverlayListener('LogLine', (data) => {
    // console.log(data)
    Object.values(REGISTRIES)
        .forEach(registry => {
            if (!registry.testLine(data.line[0]))
                return;

            const execId = parseInt(data.line[2], 16);
            const player = party.find(player => player.id === execId);

            if(!player)
                return;

            registry.getActions().forEach(ac => ac.test(player, data))
        });

    if(data.line[0] === "03")
    {
        let player = party.find(player => data.line[3] === player.name);

        if(!player)
        {
            if(party.length <= 1 && data.line[3] === self.name)
                player = self;

            if(!player)
                return;
        }

        if(updatePlayer(playerParser({...player,
                id: data.line[2],
                job: parseInt(data.line[4], 16),
                level: parseInt(data.line[5], 16),
            })))
            reset();
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

(await import('./setup.js')).run();

startOverlayEvents();

frameUpdate(UPDATE);