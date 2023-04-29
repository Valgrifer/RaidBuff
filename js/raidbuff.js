import {ActionJobLevel, Jobs} from "./utils";
import {Action, ActionElementState} from "./Action";

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
        this.buffs = [];

        console.log("Register Buff: \"" + name + "\"\t\t with id (" + id + "),\t\t Cool-down: " + cd + "s ,\t\t Duration: " + time + "s,\t\t Desc:" + desc);
    }


    /**
     * Updates the state of the buff.
     */
    update()
    {
        let now = Date.now();

        let b, el, action, time, timer, toShow, toShowRound;

        for (let i = 0; i < this.buffs.length; i++)
        {
            b = this.buffs[i];
            el = this.getElement(b);
            action = el.getAction();

            if(action.getState() === ActionElementState.Up)
                continue;

            time = el.getAttribute("time");

            if(time)
            {
                timer = (now - time) / 1000;

                if(action.getState() === ActionElementState.Active)
                {
                    toShow = this.time - timer;
                    if(timer > this.time)
                        action.setState(ActionElementState.Active);
                }
                else if(action.getState() === ActionElementState.Fade)
                {
                    toShow = this.cd - timer;
                    if(timer > this.cd)
                        action.setState(ActionElementState.Up);
                }

                this.getRegistry().getOrder().push({element: el, timer: toShow});
                toShowRound = Math.floor(toShow);
                if(toShowRound >= 0 && el.innerHTML !== toShowRound)
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
}