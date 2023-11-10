module.exports = class {
    /** 
     * The ID of this note 
     * @type {?number} 
     */
    noteID = null;
    /** 
     * The ID of the user who this note belongs to 
     * @type {?number} 
     */
    userID = null;
    /** 
     * The date this note was last edited on 
     * @type {?DateTime} 
     */
    dateEdited = null;
    /** 
     * The user-defined title of this note 
     * @type {?string} 
     */
    title = null;
    /** 
     * The number of slides in the slide set 
     * @type {?number} 
     */
    slideCount = null;

    /**
     * Create a new note object form a row in the notes table
     * @param {*} data 
     */
    constructor(data) {
        this.noteID = data.noteID;
        this.userID = data.userID;
        this.dateEdited = data.dateEdited;
        this.title = data.title;
        this.slideCount = data.slideCount;
    }
}