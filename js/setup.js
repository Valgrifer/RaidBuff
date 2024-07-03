import {RaidBuff} from "./action/raidbuff.js";
import {ActionJobLevel, Job, JobCategory, Jobs} from "./utils.js";
import {REGISTRIES, Registry} from "./registry.js";
import {SelfCoolDown} from "./action/selfCoolDown.js";
import {reset} from "./script.js";

const ModalOn = false;

export function run() {
    {
        const RaidBuffRegistry = new Registry("RaidBuff", document.querySelector(".container#raidBuff"), /^21|22$/);

        new RaidBuff(RaidBuffRegistry, "ChainStratagem", "1D0C", "https://xivapi.com/i/002000/002815_hr1.png", 120, 20, "10% CH", ActionJobLevel(Jobs.SCH, 66), true);
        new RaidBuff(RaidBuffRegistry, "Divination", "40A8", "https://xivapi.com/i/003000/003553_hr1.png", 120, 20, "6%", ActionJobLevel(Jobs.AST, 50));
        new RaidBuff(RaidBuffRegistry, "Brotherhood", "1CE4", "https://xivapi.com/i/002000/002542_hr1.png", 120, 20, "5%", ActionJobLevel(Jobs.MNK, 70));
        new RaidBuff(RaidBuffRegistry, "BattleLitany", "DE5", "https://xivapi.com/i/002000/002585_hr1.png", 120, 20, "10% CH", ActionJobLevel(Jobs.DRG, 52));
        new RaidBuff(RaidBuffRegistry, "Mug", "8C8", "https://xivapi.com/i/000000/000613_hr1.png", 120, 20, "5%", ActionJobLevel(Jobs.NIN, 14), true);
        new RaidBuff(RaidBuffRegistry, "ArcaneCircle", "5F55", "https://xivapi.com/i/003000/003633_hr1.png", 120, 20, "3%", ActionJobLevel(Jobs.RPR, 72));
        new RaidBuff(RaidBuffRegistry, "BattleVoice", "76", "https://xivapi.com/i/002000/002601_hr1.png", 120, 20, "20% DH", ActionJobLevel(Jobs.BRD, 50));
        new RaidBuff(RaidBuffRegistry, "RadiantFinale", "64B9", "https://xivapi.com/i/002000/002622_hr1.png", 110, 20, (data) => {
            let p = "2";
            if (data && data.line && data.line[8])
                p = data.line[8].substring(0, 1);
            return p + "%";
        }, ActionJobLevel(Jobs.BRD, 90));
        new RaidBuff(RaidBuffRegistry, "TechnicalFinish", "(3E84|3F4(1|2|3|4))", "https://xivapi.com/i/003000/003473_hr1.png", 120, 20, (data) => {
            let p = "0";
            if (data && data.line && data.line[4] !== "3E84") {
                p = data.line[4].substring(3);
                if (p === "4")
                    p = "5";
            }
            return p + "%";
        }, ActionJobLevel(Jobs.DNC, 70));
        new RaidBuff(RaidBuffRegistry, "SearingLight", "64C9", "https://xivapi.com/i/002000/002752_hr1.png", 120, 20, "5%", ActionJobLevel(Jobs.SMN, 66));
        new RaidBuff(RaidBuffRegistry, "Embolden", "1D60", "https://xivapi.com/i/003000/003218_hr1.png", 120, 20, "5%", ActionJobLevel(Jobs.RDM, 58));
        new RaidBuff(RaidBuffRegistry, "Starry Muse", "8773", "https://xivapi.com/i/003000/003826_hr1.png", 120, 20, "5%", ActionJobLevel(Jobs.PCT, 70));
        new RaidBuff(RaidBuffRegistry, "Off-guard", "2C93", "https://xivapi.com/i/003000/003279_hr1.png", 60, 15, "5%");
        new RaidBuff(RaidBuffRegistry, "PeculiarLight", "2C9D", "https://xivapi.com/i/003000/003289_hr1.png", 60, 15, "5% Mag");
    }

    if (ModalOn) {
        const SelfDEFRegistry = new Registry('SelfDefensive', document.querySelector(".container#selfDEF"));
        const SelfDMGRegistry = new Registry('SelfDamage', document.querySelector(".container#selfDMG"));
        // Tank
        {
            {
                new SelfCoolDown(SelfDEFRegistry, "Rampart", "1D6B", "https://xivapi.com/i/000000/000801_hr1.png", 90, 20, ActionJobLevel(JobCategory.Tank, 8));
                new SelfCoolDown(SelfDEFRegistry, "Reprisal", "1D6F", "https://xivapi.com/i/000000/000806_hr1.png", 60, 0, ActionJobLevel(JobCategory.Tank, 22));
                new SelfCoolDown(SelfDEFRegistry, "ArmsLength", "1D7C", "https://xivapi.com/i/000000/000822_hr1.png", 120, 6, ActionJobLevel([JobCategory.Tank, JobCategory.Melee, JobCategory.Range], 32));
                new SelfCoolDown(SelfDEFRegistry, "Shirk", "1D71", "https://xivapi.com/i/000000/000810_hr1.png", 120, 0, ActionJobLevel(JobCategory.Tank, 48));
            }

            // PLD
            {
                new SelfCoolDown(SelfDMGRegistry, "FightOrFlight", "14", "https://xivapi.com/i/000000/000166_hr1.png", 60, 20, ActionJobLevel(Jobs.PLD, 2));
                new SelfCoolDown(SelfDEFRegistry, "Sentinel", "11", "https://xivapi.com/i/000000/000151_hr1.png", 120, 15, ActionJobLevel(Jobs.PLD, 38));
                new SelfCoolDown(SelfDEFRegistry, "HallowedGround", "1E", "https://xivapi.com/i/002000/002502_hr1.png", 420, 10, ActionJobLevel(Jobs.PLD, 50));
                new SelfCoolDown(SelfDEFRegistry, "Bulwark", "16", "https://xivapi.com/i/000000/000167_hr1.png", 90, 10, ActionJobLevel(Jobs.PLD, 52));
                new SelfCoolDown(SelfDEFRegistry, "DivineVeil", "DD4", "https://xivapi.com/i/002000/002508_hr1.png", 90, 0, ActionJobLevel(Jobs.PLD, 56));
                new SelfCoolDown(SelfDMGRegistry, "GoringBlade", "DD2", "https://xivapi.com/i/002000/002506_hr1.png", 60, 0, ActionJobLevel(Jobs.PLD, 54));
                new SelfCoolDown(SelfDMGRegistry, "Requiescat", "1CD7", "https://xivapi.com/i/002000/002513_hr1.png", 60, 0, ActionJobLevel(Jobs.PLD, 68));
                new SelfCoolDown(SelfDEFRegistry, "PassageOfArms", "1CD9", "https://xivapi.com/i/002000/002515_hr1.png", 120, 0, ActionJobLevel(Jobs.PLD, 70));
            }

            // WAR
            {
                new SelfCoolDown(SelfDMGRegistry, "InnerRelease", "26|1CDD", "https://xivapi.com/i/002000/002564_hr1.png", 60, 0, ActionJobLevel(Jobs.WAR, 6));
                new SelfCoolDown(SelfDEFRegistry, "ThrillOfBattle", "28", "https://xivapi.com/i/000000/000263_hr1.png", 90, 10, ActionJobLevel(Jobs.WAR, 30));
                new SelfCoolDown(SelfDEFRegistry, "Vengeance", "2C", "https://xivapi.com/i/000000/000267_hr1.png", 120, 10, ActionJobLevel(Jobs.WAR, 38));
                new SelfCoolDown(SelfDEFRegistry, "Holmgang", "2B", "https://xivapi.com/i/000000/000266_hr1.png", 240, 0, ActionJobLevel(Jobs.WAR, 42));
                new SelfCoolDown(SelfDEFRegistry, "ShakeItOff", "1CDC", "https://xivapi.com/i/002000/002563_hr1.png", 90, 0, ActionJobLevel(Jobs.WAR, 68));
                new SelfCoolDown(SelfDEFRegistry, "Equilibrium", "DE0", "https://xivapi.com/i/002000/002560_hr1.png", 60, 15, ActionJobLevel(Jobs.WAR, 58));
            }

            // DRK
            {
                new SelfCoolDown(SelfDMGRegistry, "BloodWeapon", "E29", "https://xivapi.com/i/003000/003071_hr1.png", 60, 15, ActionJobLevel(Jobs.DRK, 35));
                new SelfCoolDown(SelfDMGRegistry, "CarveAndSpit", "E3B", "https://xivapi.com/i/003000/003058_hr1.png", 60, 0, ActionJobLevel(Jobs.DRK, 60));
                new SelfCoolDown(SelfDMGRegistry, "SaltedEarth", "E37", "https://xivapi.com/i/003000/003066_hr1.png", 90, 15, ActionJobLevel(Jobs.DRK, 52));
                new SelfCoolDown(SelfDMGRegistry, "LivingShadow", "4058", "https://xivapi.com/i/003000/003088_hr1.png", 120, 0, ActionJobLevel(Jobs.DRK, 80));
                new SelfCoolDown(SelfDMGRegistry, "Delirium", "1CDE", "https://xivapi.com/i/003000/003078_hr1.png", 60, 0, ActionJobLevel(Jobs.DRK, 68));
                new SelfCoolDown(SelfDEFRegistry, "LivingDead", "E36", "https://xivapi.com/i/003000/003077_hr1.png", 300, 300, ActionJobLevel(Jobs.DRK, 50));
                new SelfCoolDown(SelfDEFRegistry, "DarkMissionary", "4057", "https://xivapi.com/i/003000/003087_hr1.png", 90, 90, ActionJobLevel(Jobs.DRK, 76));
                new SelfCoolDown(SelfDEFRegistry, "DarkMind", "E32", "https://xivapi.com/i/003000/003076_hr1.png", 60, 60, ActionJobLevel(Jobs.DRK, 45));
                new SelfCoolDown(SelfDEFRegistry, "ShadowWall", "E34", "https://xivapi.com/i/003000/003075_hr1.png", 120, 120, ActionJobLevel(Jobs.DRK, 38));
            }

            // GNB
            {
                new SelfCoolDown(SelfDMGRegistry, "NoMercy", "3F0A", "https://xivapi.com/i/003000/003402_hr1.png", 60, 20, ActionJobLevel(Jobs.GNB, 2));
                new SelfCoolDown(SelfDMGRegistry, "Bloodfest", "3F24", "https://xivapi.com/i/003000/003428_hr1.png", 120, 0, ActionJobLevel(Jobs.GNB, 76));
                new SelfCoolDown(SelfDEFRegistry, "Superbolide", "3F18", "https://xivapi.com/i/003000/003416_hr1.png", 360, 10, ActionJobLevel(Jobs.GNB, 50));
                new SelfCoolDown(SelfDEFRegistry, "HeartOfLight", "3F20", "https://xivapi.com/i/003000/003424_hr1.png", 90, 15, ActionJobLevel(Jobs.GNB, 64));
                new SelfCoolDown(SelfDEFRegistry, "Nebula", "3F14", "https://xivapi.com/i/003000/003412_hr1.png", 120, 15, ActionJobLevel(Jobs.GNB, 38));
                new SelfCoolDown(SelfDEFRegistry, "Camouflage", "3F0C", "https://xivapi.com/i/003000/003404_hr1.png", 90, 20, ActionJobLevel(Jobs.GNB, 6));
            }
        }

        //Heal
        {
            {
                new SelfCoolDown(SelfDEFRegistry, "LucidDreaming", "1D8A", "https://xivapi.com/i/000000/000865_hr1.png", 60, 21, ActionJobLevel(JobCategory.Heal, 14));
                new SelfCoolDown(SelfDEFRegistry, "Swiftcast", "1D89", "https://xivapi.com/i/000000/000866_hr1.png", 60, 0, ActionJobLevel(JobCategory.Heal, 18));
                new SelfCoolDown(SelfDEFRegistry, "Surecast", "1D87", "https://xivapi.com/i/000000/000869_hr1.png", 120, 6, ActionJobLevel(JobCategory.Heal, 44));
            }

            // WHM
            {
                new SelfCoolDown(SelfDMGRegistry, "PresenceOfMind", "88", "https://xivapi.com/i/002000/002626_hr1.png", 120, 15, ActionJobLevel(Jobs.WHM, 30));
                new SelfCoolDown(SelfDEFRegistry, "Benediction", "8C", "https://xivapi.com/i/002000/002627_hr1.png", 180, 0, ActionJobLevel(Jobs.WHM, 50));
                new SelfCoolDown(SelfDEFRegistry, "Asylum", "DF1", "https://xivapi.com/i/002000/002632_hr1.png", 90, 24, ActionJobLevel(Jobs.WHM, 52));
                new SelfCoolDown(SelfDEFRegistry, "Tetragrammaton", "DF2", "https://xivapi.com/i/002000/002633_hr1.png", 60, 0, ActionJobLevel(Jobs.WHM, 60));
                new SelfCoolDown(SelfDEFRegistry, "PlenaryIndulgence", "1D09", "https://xivapi.com/i/002000/002639_hr1.png", 60, 10, ActionJobLevel(Jobs.WHM, 70));
                new SelfCoolDown(SelfDEFRegistry, "Temperance", "4098", "https://xivapi.com/i/002000/002645_hr1.png", 120, 20, ActionJobLevel(Jobs.WHM, 80));
                new SelfCoolDown(SelfDEFRegistry, "Aquaveil", "6505", "https://xivapi.com/i/002000/002648_hr1.png", 60, 8, ActionJobLevel(Jobs.WHM, 86));
                new SelfCoolDown(SelfDEFRegistry, "LiturgyOfTheBell", "6506", "https://xivapi.com/i/002000/002649_hr1.png", 180, 0, ActionJobLevel(Jobs.WHM, 90));
            }

            // SCH
            {
                new SelfCoolDown(SelfDMGRegistry, "Aetherflow", "A6", "https://xivapi.com/i/000000/000510_hr1.png", 60, 0, ActionJobLevel(Jobs.SCH, 45));
                new SelfCoolDown(SelfDEFRegistry, "WhisperingDawn", "4099", "https://xivapi.com/i/002000/002852_hr1.png", 60, 21, ActionJobLevel(Jobs.SCH, 20));
                new SelfCoolDown(SelfDEFRegistry, "FeyIllumination", "409A", "https://xivapi.com/i/002000/002853_hr1.png", 120, 20, ActionJobLevel(Jobs.SCH, 40));
                new SelfCoolDown(SelfDEFRegistry, "DeploymentTactics", "E01", "https://xivapi.com/i/002000/002808_hr1.png", 120, 0, ActionJobLevel(Jobs.SCH, 56));
                new SelfCoolDown(SelfDEFRegistry, "Recitation", "409E", "https://xivapi.com/i/002000/002822_hr1.png", 90, 0, ActionJobLevel(Jobs.SCH, 74));
                new SelfCoolDown(SelfDEFRegistry, "FeyBlessing", "409F", "https://xivapi.com/i/002000/002854_hr1.png", 60, 0, ActionJobLevel(Jobs.SCH, 76));
                new SelfCoolDown(SelfDEFRegistry, "SummonSeraph", "40A1", "https://xivapi.com/i/002000/002850_hr1.png", 120, 22, ActionJobLevel(Jobs.SCH, 80));
                new SelfCoolDown(SelfDEFRegistry, "Protraction", "650B", "https://xivapi.com/i/002000/002877_hr1.png", 60, 10, ActionJobLevel(Jobs.SCH, 86));
                new SelfCoolDown(SelfDEFRegistry, "Expedient", "650C", "https://xivapi.com/i/002000/002878_hr1.png", 120, 20, ActionJobLevel(Jobs.SCH, 90));
            }

            // AST
            {
                new SelfCoolDown(SelfDMGRegistry, "Lightspeed", "E16", "https://xivapi.com/i/003000/003135_hr1.png", 120, 15, ActionJobLevel(Jobs.AST, 6));
                new SelfCoolDown(SelfDMGRegistry, "MinorArcana", "1D13", "https://xivapi.com/i/003000/003106_hr1.png", 60, 0, ActionJobLevel(Jobs.AST, 70));
                new SelfCoolDown(SelfDEFRegistry, "CollectiveUnconscious", "E1D", "https://xivapi.com/i/003000/003140_hr1.png", 60, 0, ActionJobLevel(Jobs.AST, 58));
                new SelfCoolDown(SelfDEFRegistry, "CelestialOpposition", "40A9", "https://xivapi.com/i/003000/003142_hr1.png", 60, 0, ActionJobLevel(Jobs.AST, 60));
                new SelfCoolDown(SelfDEFRegistry, "EarthlyStar", "1D0F", "https://xivapi.com/i/003000/003143_hr1.png", 60, 0, ActionJobLevel(Jobs.AST, 62));
                new SelfCoolDown(SelfDEFRegistry, "Horoscope", "40AD", "https://xivapi.com/i/003000/003550_hr1.png", 60, 0, ActionJobLevel(Jobs.AST, 76));
                new SelfCoolDown(SelfDEFRegistry, "NeutralSect", "40AF", "https://xivapi.com/i/003000/003552_hr1.png", 120, 20, ActionJobLevel(Jobs.AST, 80));
                new SelfCoolDown(SelfDEFRegistry, "Exaltation", "6511", "https://xivapi.com/i/003000/003561_hr1.png", 60, 8, ActionJobLevel(Jobs.AST, 86));
                new SelfCoolDown(SelfDEFRegistry, "Macrocosmos", "6512", "https://xivapi.com/i/003000/003562_hr1.png", 180, 0, ActionJobLevel(Jobs.AST, 90));
            }

            // SGE
            {
                new SelfCoolDown(SelfDEFRegistry, "PhysisII", "5EE[0E]", "https://xivapi.com/i/003000/003670_hr1.png", 60, 15, ActionJobLevel(Jobs.SGE, 20));
                new SelfCoolDown(SelfDEFRegistry, "Soteria", "5EE6", "https://xivapi.com/i/003000/003662_hr1.png", 90, 0, ActionJobLevel(Jobs.SGE, 35));
                new SelfCoolDown(SelfDEFRegistry, "Zoe", "5EEC", "https://xivapi.com/i/003000/003668_hr1.png", 120, 0, ActionJobLevel(Jobs.SGE, 56));
                new SelfCoolDown(SelfDEFRegistry, "Haima", "5EF1", "https://xivapi.com/i/003000/003673_hr1.png", 120, 0, ActionJobLevel(Jobs.SGE, 70));
                new SelfCoolDown(SelfDEFRegistry, "Rhizomata", "5EF5", "https://xivapi.com/i/003000/003677_hr1.png", 90, 0, ActionJobLevel(Jobs.SGE, 74));
                new SelfCoolDown(SelfDEFRegistry, "Holos", "5EF6", "https://xivapi.com/i/003000/003678_hr1.png", 120, 20, ActionJobLevel(Jobs.SGE, 76));
                new SelfCoolDown(SelfDEFRegistry, "Panhaima", "5EF7", "https://xivapi.com/i/003000/003679_hr1.png", 120, 0, ActionJobLevel(Jobs.SGE, 80));
                new SelfCoolDown(SelfDEFRegistry, "Pneuma", "5EFE", "https://xivapi.com/i/003000/003686_hr1.png", 120, 0, ActionJobLevel(Jobs.SGE, 90));
            }
        }
    }
    reset();

    if (ModalOn) {
        const MOKey= "modal-open";
        document.querySelector("#settings").onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            document.body.classList.add(MOKey);
        };
        document.body.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            if(document.body.classList.contains(MOKey))
            {
                document.body.classList.remove(MOKey);
                reset();
            }
        };

        const modal = document.querySelector(".modal");
        const modalContent = modal.querySelector(".modal-content");

        modal.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };

        modalContent.innerHTML = Object.values(REGISTRIES)
            .map(template.category)
            .join("");

        const CKey = ".category";
        modalContent.querySelectorAll(CKey + " .category-title").forEach(el => el.onclick = () => {
            const parent = el.closest(CKey);
            if(!parent.classList.toggle("open"))
                parent.querySelectorAll(".open")
                    .forEach(el => el.classList.remove("open"))
        });
        modalContent.querySelectorAll(".category").forEach(cat => {
            if (cat.querySelector(".category"))
                cat.querySelector(".category-content>div").classList.add("column");
        });

        modalContent.querySelectorAll(CKey + " .category-action")
            .forEach(el => el.onclick = () => {
                const newValue = el.classList.toggle("active");
                REGISTRIES[el.closest(CKey + "[data-id]").dataset.id]
                    .getActions()
                    .find(action => action.getName() === el.dataset.id)
                    .setActive(newValue);
                modalContent.querySelectorAll(`div[data-id=${el.dataset.id}]`)
                    .forEach(el => el.classList.toggle("active", newValue));
            });
    }
}

const subJobCategory = [
    "SelfDamage",
    "SelfDefensive",
];

/**
 *
 * @param {{name: string, actions: Action[]}[]} list
 * @param {Action} action
 * @return {{name: string, actions: Action[]}[]}
 */
const filterJobCategory = (list, action) => {
    const ajl = action.getActionJobLevel();

    /**
     *
     * @type {{name: string, actions: Action[]}[]}
     */
    const datas = (Array.isArray(ajl.job) ? ajl.job.map(ajl => ajl.job) : [ajl.job]).map(filter => {
        let result;
        if ((result = list.find(data => (filter instanceof Job ? filter.name : filter) === data.name)) !== undefined)
            return result;

        result = {
            name: filter instanceof Job ? filter.name : filter,
            actions: []
        };

        list.push(result);

        return result;
    });

    datas.forEach(data => data.actions.push(action));

    return list;
};

const template = {
    category: (registries) =>  `
                    <div class="category" data-id="%id%">
                        <h2 class="category-title">%name%</h2>
                        <div class="category-content">
                            <div>
                                %items%
                            </div>
                        </div>
                    </div>`
        .replace(/%(name|id)%/g, registries.getName())
        .replace("%items%", subJobCategory.includes(registries.getName()) ?
            registries.getActions()
                .reduce(filterJobCategory, [])
                .map(template.subCategory)
                .join(""):
            registries.getActions()
                .map(template.categoryItem)
                .join("")),
    subCategory: (data) =>  `
                    <div class="category">
                        <h2 class="category-title">%name%</h2>
                        <div class="category-content">
                            <div>
                                %items%
                            </div>
                        </div>
                    </div>`
        .replace("%name%", data.name)
        .replace("%items%", data.actions
            .map(template.categoryItem)
            .join("")),
    categoryItem: (action) => `
                    <div class="category-action%active%" style="--image: %image%; order: %order%" data-id="%id%"></div>`
        .replace("%id%", action.getName())
        .replace("%image%", `url(${action.getImage()})`)
        .replace("%active%", action.isActive() ? " active" : "")
        .replace("%order%", action.getActionJobLevel().job !== Jobs.NONE ? action.getActionJobLevel().lvl : "1000")
};