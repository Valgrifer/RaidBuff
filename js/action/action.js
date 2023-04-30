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
 * @class
 */
class ActionElement {
    /**
     * Create an instance of ActionElement.
     * @param {HTMLElement} element - The HTML element representing the action element.
     * @param {Action} mainAction - The associated MainAction for this element.
     */
    constructor(element, mainAction) {
        this.element = element;
        this.mainAction = mainAction;
    }

    /**
     * Returns the associated MainAction for this element.
     * @returns {Action} The associated MainAction.
     */
    getMainAction() {
        return this.mainAction;
    }

    /**
     * Sets the state of the element.
     * @param {ActionElementState} state - The state to set.
     * @param {{any}|undefined} data - Optional data associated with the state.
     */
    setState(state, data = undefined) {
        this.getMainAction().setState(this.element, state, data);
    }

    /**
     * Returns the current state of the element.
     * @returns {ActionElementState} The current state of the element.
     */
    getState() {
        if (this.element.classList.contains("active"))
            return ActionElementState.Active;
        else if (this.element.classList.contains("up"))
            return ActionElementState.Up;
        else
            return ActionElementState.Fade;
    }
}

/**
 * Represents the null action element state.
 * @type ActionElement
 */
const NullActionElementState = new class extends ActionElement {
    getMainAction() {return undefined;}
    setState(state, data) {}
    getState() {return undefined;}
} (null, null);

/**
 * Returns the associated action for the HTML element.
 * @return {ActionElement|undefined} - The associated action element.
 */
HTMLElement.prototype.getAction = function() {
    // noinspection JSUnresolvedVariable
    return this._classAction ?? NullActionElementState;
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

            div._classAction = new ActionElement(div, this);

            this.getRegistry().getContainer().appendChild(div);
            this.getPlayers().push(player);
        }

        return div;
    }

    /**
     * Sets the state of the action element for the specified player.
     * @param {string|HTMLElement} element - The player name or Element Action.
     * @param {ActionElementState} state - The state to set.
     * @param {{any}|undefined} data - Additional data for setting the state.
     * @abstract
     */
    setState(element, state, data = undefined)
    {
        throw new Error("Method not implemented.");
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