import {RaidBuff} from "./raidbuff.js";
import {ActionJobLevel, Jobs} from "./utils.js";
import {Registry} from "./registry.js";
export function run() {
    const RaidBuffRegistry = new Registry('RaidBuff', document.querySelector(".container"));

    new RaidBuff(RaidBuffRegistry, "StratagemesEntrelaces", "1D0C", "https://xivapi.com/i/002000/002815_hr1.png", 120, 15, "10% CH", ActionJobLevel(Jobs.SCH, 66));
    new RaidBuff(RaidBuffRegistry, "Divination", "40A8", "https://xivapi.com/i/003000/003553_hr1.png", 120, 15, "6%", ActionJobLevel(Jobs.AST, 50));
    new RaidBuff(RaidBuffRegistry, "Fraternite", "1CE4", "https://xivapi.com/i/002000/002542_hr1.png", 120, 15, "5%", ActionJobLevel(Jobs.MNK, 70));
    new RaidBuff(RaidBuffRegistry, "LitanieCombattante", "DE5", "https://xivapi.com/i/002000/002585_hr1.png", 120, 15, "10% CH", ActionJobLevel(Jobs.DRG, 52));
    new RaidBuff(RaidBuffRegistry, "Rapine", "8C8", "https://xivapi.com/i/000000/000613_hr1.png", 120, 20, "5%", ActionJobLevel(Jobs.NIN, 14));
    new RaidBuff(RaidBuffRegistry, "CercleArcanique", "5F55", "https://xivapi.com/i/003000/003633_hr1.png", 120, 20, "3%", ActionJobLevel(Jobs.RPR, 72));
    new RaidBuff(RaidBuffRegistry, "VoixDeCombat", "76", "https://xivapi.com/i/002000/002601_hr1.png", 120, 15, "20% DH", ActionJobLevel(Jobs.BRD, 50));
    new RaidBuff(RaidBuffRegistry, "FinalRadieux", "64B9", "https://xivapi.com/i/002000/002622_hr1.png", 110, 15, (data) => {
        let p = "2";
        // noinspection JSUnresolvedReference
        if(data && data.line && data.line[8])
            p = data.line[8].substring(0, 1);
        return p + "%";
    }, ActionJobLevel(Jobs.BRD, 90));
    new RaidBuff(RaidBuffRegistry, "FinalTechnique", "(3E84|3F4(1|2|3|4))", "https://xivapi.com/i/003000/003473_hr1.png", 120, 20, (data) => {
        let p = "0";
        // noinspection JSUnresolvedReference
        if(data && data.line && data.line[4] !== "3E84")
        {
            p = data.line[4].substring(3);
            if(p === "4")
                p = "5";
        }
        return p + "%";
    }, ActionJobLevel(Jobs.DNC, 70));
    new RaidBuff(RaidBuffRegistry, "EclatArdent", "64C9", "https://xivapi.com/i/002000/002752_hr1.png", 120, 30, "3%", ActionJobLevel(Jobs.SMN, 66));
    new RaidBuff(RaidBuffRegistry, "Enhardissement", "1D60", "https://xivapi.com/i/003000/003218_hr1.png", 120, 20, "5%", ActionJobLevel(Jobs.RDM, 58));
    new RaidBuff(RaidBuffRegistry, "SansDefense", "2C93", "https://xivapi.com/i/003000/003279_hr1.png", 60, 15, "5%");
    new RaidBuff(RaidBuffRegistry, "LumiereSinistre", "2C9D", "https://xivapi.com/i/003000/003289_hr1.png", 60, 15, "5% Mag");
}