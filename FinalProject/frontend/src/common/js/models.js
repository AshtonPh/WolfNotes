export class Note {
    /** @type {number} the ID of this note */
    noteID;
    /** @type {Date} the last edit date/time of this note */
    dateEdited;
    /** @type {Tag[]} a list of tags associated with this note */
    tags;
    /** @type {string} the title of this note */
    title;
    /** @type {number} number of slides */
    slideCount;

    static fromApi(data) {
        let note = new Note;
        note.noteID = data.noteID;
        note.title = data.title;
        note.dateEdited = new Date(data.dateEdited);
        note.slideCount = data.slideCount;
        return note;
    }

    static fromJson(data) {
        let note = new Note;
        note.noteID = data.noteID;
        note.title = data.title;
        note.dateEdited = new Date(data.dateEdited);
        note.slideCount = data.slideCount;
        note.tags = data.tags.map(t => Tag.fromApi(t));
        return note;
    }
}

export class Tag {
    /** @type {number} the ID of this tag */
    tagID;
    /** @type {string} the name of this tag */
    tagName;

    static fromApi(data) {
        let tag = new Tag;
        tag.tagID = data.tagID;
        tag.tagName = data.tagName;
        return tag;
    }
}