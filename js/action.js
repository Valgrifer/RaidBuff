import {Before} from "./pseudoStyles.js";

export const cssClass = "action";

/**
 * Represents the state of an action element.
 * @typedef {string} ActionElementState
 */

/**
 * Enumeration of possible action element states.
 * @readonly
 * @enum {ActionElementState}
 */
export const ActionElementState = Object.freeze({
    Active: 'Active',
    Fade: 'Fade',
    Up: 'Up',
})


/**
 * Represents an action element.
 * @typedef ActionElement
 * @readonly
 * @property {function(): RaidBuff|undefined} getRaidBuff - Returns the associated RaidBuff for this element.
 * @property {function(ActionElementState): void} setState - Sets the state of the element.
 * @property {function(): ActionElementState} getState - Returns the current state of the element.
 */

/**
 * Represents the null action element state.
 * @type ActionElement
 */
const NullActionElementState = Object.freeze({
    getRaidBuff() {return undefined},
    setState() {},
    getState() {return undefined},
});

/**
 * Returns the associated action for the HTML element.
 * @return {ActionElement|undefined} - The associated action element.
 */
HTMLElement.prototype.getAction = function() {
    // noinspection JSUnresolvedVariable
    return this._action ?? NullActionElementState;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Represents an action.
 * @abstract
 * @class
 */
export class Action {
    /**
     * Creates an instance of the Action class.
     * @param {Registry} registry - The registry instance.
     * @param {RegExp} id - The action ID.
     * @param {string} name - The action name.
     * @param {string} image - The image associated with the action.
     * @param {ActionJobLevel} ajl - The action job level.
     */
    constructor(registry, id, name, image, ajl) {
        if (new.target === Action) {
            throw new Error('Cannot instantiate abstract class.');
        }

        this._registry = registry;
        registry.addAction(this);
        this._id = id;
        this._name = name;
        this._image = image;
        this._ajl = ajl;
        this._players = [];
    }

    /**
     * @abstract
     */
    update() {
        throw new Error("Method not implemented.");
    }

    /**
     * Returns the registry instance associated with the action.
     * @return {Registry} - The registry instance.
     */
    getRegistry()
    { return this._registry; }

    /**
     * Returns the ID of the action.
     * @return {RegExp} - The action ID.
     */
    getID()
    { return this._id; }

    /**
     * Returns the name of the action.
     * @return {string} - The action name.
     */
    getName()
    { return this._name; }

    /**
     * Returns the image associated with the action.
     * @return {string} - The action image.
     */
    getImage()
    { return this._image; }


    /**
     * Returns the action job level.
     * @return {ActionJobLevel} - The action job level.
     */
    getActionJobLevel()
    { return this._ajl; }

    /**
     * Returns the list of players associated with the action.
     * @return {Array<string>} - The list of player names.
     */
    getPlayers()
    { return this._players; }
    /**
     * Returns the HTML element associated with the action and player.
     * @param {string} player - The player name.
     * @return {HTMLElement} - The associated HTML element
     */
    getElement(player)
    {
        /** @type {HTMLElement} */
        let div = this.getRegistry().getContainer().querySelector(`.${cssClass}#${this.getName()}${player}`);

        if(!div)
        {
            div = document.createElement("div");

            div.classList.add(cssClass);
            div.style.backgroundImage = `url("${this.getImage()}")`;
            div.id = this.getName() + player;

            /** @type {ActionElement} */
            div._classAction = {
                getRaidBuff: (function () {
                    return this;
                }).bind(this),
                setState: (function (state, data) {
                    switch (state) {
                        case ActionElementState.Active:
                            this.setAttribute("time", Date.now());
                            this.classList.add("active");
                            this.classList.remove("up");
                            this.innerHTML = "" + this.time;
                            this.pseudoStyle(Before, "content", `"${this.getAction().getRaidBuff().getDescription(data)}"`)
                                .pseudoStyle(Before, "background-color", "black")
                            break;
                        case ActionElementState.Fade:
                            this.classList.remove("active");
                            this.classList.remove("up");
                            this.innerHTML = "" + (this.cd - this.time);
                            this.pseudoStyle(Before, "content", '""')
                                .pseudoStyle(Before, "background-color", "transparent")
                            break;
                        case ActionElementState.Up:
                            this.classList.remove("active");
                            this.classList.add("up");
                            this.innerHTML = "";
                            this.style.order = null;
                            break;
                    }
                }).bind(div),
                getState: (function () {
                    if(this.classList.contains("active"))
                        return ActionElementState.Active
                    else if(this.classList.contains("up"))
                        return ActionElementState.Up
                    else
                        return ActionElementState.Fade
                }).bind(div),
            };

            this.getRegistry().getContainer().appendChild(div);
            this.getPlayers().push(player);
        }

        return div;
    }

    /**
     * Sets the state of the action element for the specified player.
     * @param {string} player - The player name.
     * @param {ActionElementState} state - The state to set.
     * @param {{any}|undefined} data - Additional data for setting the state.
     */
    setState(player, state, data = undefined)
    {
        this.getElement(player)?.getAction()?.setState(state, data);
    }

    /**
     * Gets the current state of the action element for the specified player.
     * @param {string} player - The player name.
     * @return {ActionElementState} - The current state of the action element.
     */
    getState(player)
    {
        return this.getElement(player)?.getAction()?.getState();
    }
}