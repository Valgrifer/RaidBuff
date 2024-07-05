/**
 * Converts a name to an ID by removing spaces and apostrophes and converting to lowercase.
 * @param {string} name - The name to convert.
 * @returns {string} The converted ID.
 */
export function nameToId(name) {
    return name.replace(/[ ']/g, "").toLowerCase();
}

/**
 * @param {number} value
 * @param {number|{min:"gt"|"get",max:"lt"|"let"}} between
 * @returns {boolean}
 */
export function isBetween(value, ...between) {
    if (between.length < 2) {
        throw "'isBetween' need minimum 2 values";
    }
    const option = {
        min: 'gt',
        max: 'lt',
    };

    if (typeof between[between.length-1] === 'object') {
        Object.entries(between[between.length-1])
            .forEach(([k, v]) => option[k] = v);
    }

    let result = true;

    if (option.min === 'get') {
        if (Math.min(...between) > value)
            result = false;
    }
    else {
        if (Math.min(...between) >= value)
            result = false;
    }

    if (option.min === 'let') {
        if (Math.max(...between) < value)
            result = false;
    }
    else {
        if (Math.max(...between) <= value)
            result = false;
    }

    return result;
}

/**
 * Represents an Action Job Level.
 * @class
 * @param {Job|JobCategory} job - The ID of the job level.
 * @param {number} minLvl - The level of the job.
 * @param {number} maxLvl - The level of the job.
 */
export function ActionJobLevel(job, minLvl, maxLvl) {
    if (!(this instanceof ActionJobLevel)) {
        return new ActionJobLevel(job, minLvl, maxLvl);
    }

    this.job = job;
    this.minLvl = minLvl;
    this.maxLvl = maxLvl;

    if(Array.isArray(this.job))
        this.job = this.job.map(value => new ActionJobLevel(value, minLvl));
}

/**
 * @param {Player} player
 * @return boolean
 */
ActionJobLevel.prototype.test = function (player) {
    if(typeof this.job === "string")
        return this.job === player.job?.category && isBetween(player.level, this.minLvl, this.maxLvl);
    else if(Array.isArray(this.job))
        return this.job.filter(ajl => ajl.test(player)).length > 0;
    else if(this.job instanceof Job)
        return this.job.id === player.job?.id && isBetween(player.level, this.minLvl, this.maxLvl);
    return false;
};

/**
 * Represents the category of a job.
 * @typedef {string} JobCategory
 */


/**
 * Enum representing the job categories.
 * @enum {JobCategory}
 * @readonly
 */
export const JobCategory = Object.freeze({
    Tank: 'Tank',
    Heal: 'Heal',
    Melee: 'Melee',
    Range: 'Range',
    Magic: 'Magic',
});

// noinspection JSUnusedGlobalSymbols
/**
 * Represents a job.
 * @class
 * @readonly
 */
export class Job {
    /**
     * Create a job with the specified ID, name, abbreviation, and category.
     * @param {number} id - The job ID.
     * @param {string} name - The job name.
     * @param {string} abbreviation - The job abbreviation.
     * @param {JobCategory} category - The job category.
     */
    constructor(id, name, abbreviation, category) {
        /**
         * The job ID.
         * @type {number}
         * @private
         */
        this._id = id;

        /**
         * The job name.
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         * The job abbreviation.
         * @type {string}
         * @private
         */
        this._abbreviation = abbreviation;

        /**
         * The job category.
         * @type {JobCategory}
         * @private
         */
        this._category = category;
    }

    /**
     * Get the job ID.
     * @returns {number} The job ID.
     */
    get id() {
        return this._id;
    }

    /**
     * Get the job name.
     * @returns {string} The job name.
     */
    get name() {
        return this._name;
    }

    /**
     * Get the job abbreviation.
     * @returns {string} The job abbreviation.
     */
    get abbreviation() {
        return this._abbreviation;
    }

    /**
     * Get the job category.
     * @returns {JobCategory} The job category.
     */
    get category() {
        return this._category;
    }
}

/**
 * The collection of jobs.
 * @enum {Job}
 * @readonly
 */
export const Jobs = Object.freeze({
    NONE: new Job(-1, "NONE", "NONE", ''),

    PLD: new Job(19, "Paladin", "PLD", JobCategory.Tank),
    WAR: new Job(21, "Warrior", "WAR", JobCategory.Tank),
    DRK: new Job(32, "Dark Knight", "DRK", JobCategory.Tank),
    GNB: new Job(37, "Gunbreaker", "GNB", JobCategory.Tank),

    WHM: new Job(24, "White Mage", "WHM", JobCategory.Heal),
    SCH: new Job(28, "Scholar", "SCH", JobCategory.Heal),
    AST: new Job(33, "Astrologian", "AST", JobCategory.Heal),
    SGE: new Job(40, "Sage", "SGE", JobCategory.Heal),

    MNK: new Job(20, "Monk", "MNK", JobCategory.Melee),
    DRG: new Job(22, "Dragoon", "DRG", JobCategory.Melee),
    NIN: new Job(30, "Ninja", "NIN", JobCategory.Melee),
    SAM: new Job(34, "Samurai", "SAM", JobCategory.Melee),
    RPR: new Job(39, "Reaper", "RPR", JobCategory.Melee),
    VPR: new Job(41, "Viper", "VPR", JobCategory.Melee),

    BRD: new Job(23, "Bard", "BRD", JobCategory.Range),
    MCH: new Job(31, "Machinist", "MCH", JobCategory.Range),
    DNC: new Job(38, "Dancer", "DNC", JobCategory.Range),

    BLM: new Job(25, "Black Mage", "BLM", JobCategory.Magic),
    SMN: new Job(27, "Summoner", "SMN", JobCategory.Magic),
    RDM: new Job(35, "Red Mage", "RDM", JobCategory.Magic),
    PCT: new Job(42, "Pictomancer", "PCT", JobCategory.Magic),
    BLU: new Job(36, "Blue Mage", "BLU", JobCategory.Magic),
});

/**
 * Convertit un identifiant de job en objet job correspondant.
 *
 * @param {int} id - L'identifiant du job.
 * @returns {Job|undefined} - L'objet job correspondant, ou undefined si aucun job correspondant n'est trouvé.
 */
export function idToJob(id)
{
    return Object.values(Jobs).find(job => job.id === id, Jobs.NONE);
}


/**
 * Transforme les clés de l'objet en minuscules.
 *
 * @param {Object} obj - L'objet a transformé
 * @returns {Object} - L'objet transformé avec des clés en minuscules.
 */
export function transformKeysToLowerCase(obj) {
    return Object.keys(obj).reduce((acc, key) => {
        const lowercaseKey = key.toLowerCase();
        acc[lowercaseKey] = obj[key];
        return acc;
    }, {});
}

/**
 * Objet représentant une ligne de journal.
 * @typedef {Object} LogLine
 * @property {string} type - Le type de la ligne de journal.
 * @property {string[]} line - Les éléments de la ligne de journal.
 * @property {string} rawLine - La ligne de journal brute.
 */