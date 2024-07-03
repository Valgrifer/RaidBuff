import {ActionJobLevel, Jobs, nameToId} from "../utils.js";
import {Action, ActionElementState} from "./action.js";
import {self} from "../playerParty.js";

export class SelfCoolDown extends Action {
    /**
     * Creates an instance of the RaidBuff class.
     * @param {Registry} registry - The registry instance.
     * @param {string} name - The name of the buff.
     * @param {string} id - The ID of the buff.
     * @param {string} image - The image associated with the buff.
     * @param {number} cd - The cooldown duration of the buff in seconds.
     * @param {number} time - The active duration of the buff in seconds.
     * @param {ActionJobLevel} ajl - The action job level of the buff.
     */
    constructor(registry, name, id, image, cd, time, ajl = new ActionJobLevel(Jobs.NONE, 0))
    {
        super(registry, new RegExp(`^${id}$`), name, image, ajl);
        this.cd = cd;
        this.time = time;
    }


    /**
     * Updates the state of the buff.
     */
    update()
    {
        let now = Date.now();

        let action, time, timer, toShow, toShowRound;

        this.getPlayers()
            .map(this.getElement.bind(this)).forEach(el => {
            action = el.getAction();

            if(action.getState() === ActionElementState.Up)
                return;

            time = el.getAttribute("time");

            if(!time)
                return;

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
            // noinspection EqualityComparisonWithCoercionJS
            if(toShowRound > 0 && el.innerHTML != toShowRound || toShowRound === 0 && el.innerHTML !== "")
                if(toShowRound !== undefined && toShowRound !== 0)
                    el.innerHTML = toShowRound;
                else
                    el.innerHTML = "";
        });
    }

    /**
     * Sets the state of the action element for the specified player.
     * @param {string|HTMLElement} element - The player name or Element Action.
     * @param {ActionElementState} state - The state to set.
     * @param {LogLine|undefined} data - Additional data for setting the state.
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
                break;
            case ActionElementState.Fade:
                if(!element.hasAttribute("time"))
                    element.setAttribute("time", "" + Date.now());
                element.classList.remove("active");
                element.classList.remove("up");
                element.innerHTML = "" + (this.cd - this.time);
                break;
            case ActionElementState.Up:
                element.classList.remove("active");
                element.classList.add("up");
                element.innerHTML = "";
                element.style.order = null;
                break;
        }
    }

    /**
     * test action
     * @param {Player} player - The player.
     * @param {LogLine} data - Data Line.
     */
    test(player, data)
    {
        return super.test(player, data) && !(player !== self || !this.getActionJobLevel().test(player));
    }

    /**
     * test and execute action
     * @param {Player} player - The player.
     * @param {LogLine} data - Data Line.
     */
    testExecute(player, data)
    {
        if(!this.test(player, data))
            return;

        this.setState(nameToId(player.name), this.time > 0 ? ActionElementState.Active : ActionElementState.Fade, data);
    }
}