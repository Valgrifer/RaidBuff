import {ActionJobLevel, Jobs} from "../utils.js";
import {Action, ActionElementState} from "./action.js";
import {Before} from "../pseudoStyles.js";

// noinspection JSCheckFunctionSignatures
export class RaidBuff extends Action {
    /**
     * Creates an instance of the RaidBuff class.
     * @param {Registry} registry - The registry instance.
     * @param {string} name - The name of the buff.
     * @param {string} id - The ID of the buff.
     * @param {string} image - The image associated with the buff.
     * @param {number} cd - The cooldown duration of the buff in seconds.
     * @param {number} time - The active duration of the buff in seconds.
     * @param {string|function({any}): string} desc - The description of the buff.
     * @param {ActionJobLevel} ajl - The action job level of the buff.
     */
    constructor(registry, name, id, image, cd, time, desc, ajl = new ActionJobLevel(Jobs.NONE, 0))
    {
        super(registry, new RegExp(`^${id}$`), name, image, ajl);
        this.cd = cd;
        this.time = time;
        this.desc = desc;

        console.log("Register Buff: \"" + name + "\"\t\t with id (" + id + "),\t\t Cool-down: " + cd + "s ,\t\t Duration: " + time + "s,\t\t Desc:" + desc);
    }


    /**
     * Updates the state of the buff.
     */
    update()
    {
        let now = Date.now();

        let b, el, action, time, timer, toShow, toShowRound;

        for (let i = 0; i < this.getPlayers().length; i++)
        {
            b = this.getPlayers()[i];
            el = this.getElement(b);
            action = el.getAction();

            if(action.getState() === ActionElementState.Up)
                continue;

            time = el.getAttribute("time");

            if(time)
            {
                timer = (now - time) / 1000 - 1;

                if(action.getState() === ActionElementState.Active)
                {
                    toShow = this.time - timer;
                    if(timer > this.time)
                        action.setState(ActionElementState.Fade);
                }
                else if(action.getState() === ActionElementState.Fade)
                {
                    toShow = this.cd - timer;
                    if(timer > this.cd)
                        action.setState(ActionElementState.Up);
                }

                this.getRegistry().getOrder().push({element: el, timer: toShow});
                toShowRound = Math.floor(toShow);
                if(toShowRound >= 0 && parseInt(el.innerHTML) !== toShowRound)
                    if(toShowRound !== undefined)
                        el.innerHTML = toShowRound;
                    else
                        el.innerHTML = "";
            }
        }
    }

    /**
     * Returns the description of the buff.
     * @param {{any}} data - Additional data for generating the description.
     * @return {string} - The description of the buff.
     */
    getDescription(data)
    {
        return typeof this.desc === 'string' ? this.desc : (typeof this.desc === 'function' ? this.desc(data) : '');
    }

    /**
     * Sets the state of the action element for the specified player.
     * @param {string|HTMLElement} element - The player name or Element Action.
     * @param {ActionElementState} state - The state to set.
     * @param {{any}|undefined} data - Additional data for setting the state.
     */
    setState(element, state, data = undefined)
    {
        element = element instanceof HTMLElement ? element :  this.getElement(element);
        switch (state) {
            case ActionElementState.Active:
                element.setAttribute("time", "" + Date.now());
                element.classList.add("active");
                element.classList.remove("up");
                element.innerHTML = "" + this.time;
                element.pseudoStyle(Before, "content", `"${this.getDescription(data)}"`)
                    .pseudoStyle(Before, "background-color", "black");
                break;
            case ActionElementState.Fade:
                element.classList.remove("active");
                element.classList.remove("up");
                element.innerHTML = "" + (this.cd - this.time);
                element.pseudoStyle(Before, "content", '""')
                    .pseudoStyle(Before, "background-color", "transparent");
                break;
            case ActionElementState.Up:
                element.classList.remove("active");
                element.classList.add("up");
                element.innerHTML = "";
                element.style.order = null;
                break;
        }
    }
}