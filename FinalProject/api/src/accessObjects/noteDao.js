const Note = require('./models/note');
const Tag = require('./models/tag')
const conPro = require('./connectionProvider')

/**
 * Create a new note from a note object, then pass
 * @param {string} title the title of the note to create
 * @param {number} userID the user ID to create the note for
 */
async function createNote(title, userID) {
    const q = await conPro.query(
        'INSERT INTO Note (dateEdited, title, userID) VALUES (?, ?, ?)',
        [new Date(), title, userID]);
    return q.results.insertId;
}

/**
 * Set the tags for a specific note ID
 * @param {number[]} tags a list of tag IDs to assign to a note
 * @param {number} noteID the note ID to assign to
 * @returns {bool} true if every requested tag existed
 */
async function assignTags(tags, noteID) {
    // Ensure all tags exist
    let testQuery = await conPro.query('SELECT tagID FROM Tag WHERE tagID IN (?)', [tags]);
    let foundTags = testQuery.results.map(r => r.tagID);
    if (!tags.every(tID => foundTags.includes(tID))) {
        return false;
    }

    await conPro.query('DELETE FROM NoteTag WHERE noteID = ?', [noteID]);
    await conPro.query(
            // Create a query string with enough parameters for all the tag
            //  IDs being assigned
            // Since the actual values are never used during contruction, this
            //  is not vulnerable to injection
            'INSERT INTO NoteTag (noteID, tagID) VALUES ' +
            tags.map(_v => '(?, ?)').join(', '),
            tags.flatMap(v => [noteID, v])
        );
    return true;
}

/**
 * Get all notes for a specific user
 * 
 * @param {number} userID the numerical user ID to get notes for
 * @returns an array of Note objects
 */
async function getNotesByUser(userID) {
    const q = await conPro.query('SELECT * FROM Note WHERE userID = ?', [userID]);
    const notes = q.results.map(r => new Note(r));
    return await fillNoteTagIDs(notes);
}

/**
 * Get a list of 'suggested' (edited in the past week) notes
 * 
 * @param {number} userID the ID of the user to get suggestions for
 * @returns an array of Note objects
 */
async function getSuggestedNotes(userID) {
    let oneWeekAgo = new Date().setDate(new Date().getDate() - 5);
    const q = await conPro.query('SELECT noteID FROM Note WHERE userID = ? AND dateEdited > ?', [userID, oneWeekAgo]);
    return q.results.map(r => r.noteID);
}

/**
 * Get the note object for a specific note ID
 * 
 * @param {number} noteID the ID of the note to get information for
 * @returns the note, or undefined if no note with that ID was found
 */
async function getNoteByID(noteID) {
    const q = await conPro.query('SELECT * FROM Note WHERE noteID = ?', [noteID]);
    const n = q.results.length > 0 ? new Note(q.results[0]) : undefined;
    return n ? fillNoteTagIDs([n]) : n;
}

/**
 * Internal function to add tag IDs to notes
 * 
 * @param {Note[]} notes
 */
async function fillNoteTagIDs(notes) {
    const q = await conPro.query('SELECT noteID, tagID FROM NoteTag WHERE noteID in (?)', [notes.map(n => n.noteID)]);
    notes.forEach(n_1 => {
        n_1.tags = q.results
            .filter(r => r.noteID == n_1.noteID)
            .map(r_1 => r_1.tagID);
    });
    return notes;
}

/**
 * Set the title of an existing note
 * 
 * @param {number} noteID the ID of the note to set the title for
 * @param {string} title the new title to set
 * @returns a promise for the query
 */
async function setNoteTitle(noteID, title) {
    const res = await conPro.query('UPDATE Note SET title = ? WHERE noteID = ?', [title, noteID]);
    return res.affectedRows > 0;
}

/**
 * Delete a specific note from the notes table, then remove all tag associations
 * and note data associated with it.
 * 
 * @param {number} noteID the note ID to delete
 * @returns {bool} true if the note existed
 */
async function deleteNote(noteID) {
    conPro.query('DELETE FROM NoteData WHERE noteID = ?', [noteID]);
    conPro.query('DELETE FROM NoteTag WHERE noteID = ?', [noteID]);
    let q = await conPro.query('DELETE FROM Note WHERE noteID = ?', [noteID]);
    return q.results.affectedRows > 0;
}

module.exports = {createNote, assignTags, getNotesByUser, getSuggestedNotes, getNoteByID, setNoteTitle, deleteNote};