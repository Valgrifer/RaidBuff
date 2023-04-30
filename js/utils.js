/**
 * Converts a name to an ID by removing spaces and apostrophes and converting to lowercase.
 * @param {string} name - The name to convert.
 * @returns {string} The converted ID.
 */
export function nameToId(name) {
    return name.replace(/[ ']/g, "").toLowerCase();
}

/**
 * Represents an Action Job Level.
 * @class
 * @param {Job} job - The ID of the job level.
 * @param {number} lvl - The level of the job.
 */
export function ActionJobLevel(job, lvl) {
    if (!(this instanceof ActionJobLevel)) {
        return new ActionJobLevel(job, lvl);
    }

    this.job = job;
    this.lvl = lvl;
}

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
class Job {
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

    BRD: new Job(23, "Bard", "BRD", JobCategory.Range),
    MCH: new Job(31, "Machinist", "MCH", JobCategory.Range),
    DNC: new Job(38, "Dancer", "DNC", JobCategory.Range),

    BLM: new Job(25, "Black Mage", "BLM", JobCategory.Magic),
    SMN: new Job(27, "Summoner", "SMN", JobCategory.Magic),
    RDM: new Job(35, "Red Mage", "RDM", JobCategory.Magic),
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
const transformKeysToLowerCase = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
        const lowercaseKey = key.toLowerCase();
        acc[lowercaseKey] = obj[key];
        return acc;
    }, {});
};

/**
 * Analyse et transforme les données d'un joueur.
 *
 * @param {Object} data - Les données du joueur à analyser.
 * @property {number|string} id - L'ID du joueur.
 * @property {string} name - Le nom du joueur.
 * @property {number} job - L'ID du job du joueur.
 * @property {number} level - Le niveau du joueur.
 * @returns {Player} - L'objet joueur analysé.
 */
export function playerParser(data) {
    data = transformKeysToLowerCase(data);

    if(typeof data.id === "string")
        data.id = parseInt(data.id, 16);
    if(typeof data.job === "number")
        data.job = idToJob(data.job);

    return data;
}