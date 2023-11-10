export class Note {
    /** @type {number} the ID of this note */
    noteID;
    /** @type {Date} the last edit date/time of this note */
    dateEdited;
    /** @type {number[]} a list of tag IDs associated with this note */
    tags;
    /** @type {string} the title of this note */
    title;

    static fromApi(data) {
        let note = new Note;
        note.noteID = data.noteID;
        note.title = data.title;
        note.tags = data.tags;
        note.dateEdited = new Date(data.dateEdited);
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
    }
}