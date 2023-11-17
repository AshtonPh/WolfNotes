module.exports = class {
    /** @type {string} the name of the tag */
    tagName;
    /** @type {number} the numerical ID of the tag */
    tagID;

    constructor(data) {
        this.tagName = data.tagName;
        this.tagID = data.tagID;
    }
}