import {ActionElementState, cssClass} from "./Action";


/**
 * @typedef {Object.<string, Registry>} RegistryMap
 */

/**
 * @type {RegistryMap}
 */
export const REGISTRIES = {};


/**
 * @typedef {Object} OrderItem
 * @property {HTMLElement} element - The element.
 * @property {number} timer - The timer value.
 */

// noinspection JSUnusedGlobalSymbols
/**
 * Class representing a registry.
 */
export class Registry {
    /**
     * Create a registry.
     * @param {string} name - The name of the registry.
     * @param {HTMLElement} container - The container element.
     */
    constructor(name, container) {
        /**
         * The name of the registry.
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         * The container element.
         * @type {HTMLElement}
         * @private
         */
        this._container = container;

        /**
         * The array of registered actions.
         * @type {Action[]}
         * @private
         */
        this._actions = [];

        /**
         * The array of action order.
         * @type {OrderItem[]}
         * @private
         */
        this._order = [];

        REGISTRIES[name] = this;
    }

    /**
     * Get the name of the registry.
     * @returns {string} The name of the registry.
     */
    getName() {
        return this._name;
    }

    /**
     * Get the container element.
     * @returns {HTMLElement} The container element.
     */
    getContainer() {
        return this._container;
    }

    /**
     * Add an action to the registry.
     * @param {Action} action - The action to add.
     * @returns {Action} - The added action.
     */
    addAction(action) {
        if (!this._actions.includes(action)) {
            this._actions.push(action);
        }
        return action;
    }

    /**
     * Get the list of actions in the registry.
     * @returns {Action[]} - The list of actions.
     */
    getActions() {
        return this._actions;
    }

    /**
     * Get the order array.
     * @returns {OrderItem[]} The order array containing element-timer pairs.
     */
    getOrder() {
        return this._order;
    }

    /**
     * Update the registry.
     * @returns {void}
     */
    update() {
        this._order = [];
        this._actions.forEach(ac => ac.update());

        this._order.sort(function (a, b) {
            return a.timer - b.timer;
        });

        for (let i = 0; i < this._order.length; i++)
        {
            let el = this._order[i].element,
                action = el.getAction();
            if(action.getState() === ActionElementState.Active)
                el.style.order = i + "";
            else if(action.getState() === ActionElementState.Fade)
                el.style.order = i + "" + 200;
        }
    }
}

export function getAllActionElement()
{
    return document.querySelectorAll(`.${cssClass}`);
}