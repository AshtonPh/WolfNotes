const Note = require('../models/note');
const Tag = require('../models/tag')
const conPro = require('./connectionProvider')

/**
 * Create a new note from a note object, then pass
 * @param {string} title the title of the note to create
 * @param {number} userID the user ID to create the note for
 */
function createNote(title, userID) {
    return conPro.query(
        'INSERT INTO Note (dateEdited, title, userID) VALUES (?, ?, ?)',
        [new Date(), title, userID]).then(q => {
            return q.results.insertId;
        });
}

/**
 * Set the tags for a specific note ID
 * @param {number[]} tags a list of tag IDs to assign to a note
 * @param {number} noteID the note ID to assign to
 * @returns a promise for the query
 */
function assignTags(tags, noteID) {
    return conPro.query('DELETE FROM NoteTag WHERE noteID = ?', [noteID]).then(() =>
        conPro.query(
            // Create a query string with enough parameters for all the tag
            //  IDs being assigned
            // Since the actual values are never used during contruction, this
            //  is not vulnerable to injection
            'INSERT INTO NoteTag (noteID, tagID) VALUES ' +
            tags.map(_v => '(?, ?)').join(', '),
            tags.flatMap(v => [noteID, v])
        ));
}

/**
 * Get all notes for a specific user
 * 
 * @param {number} userID the numerical user ID to get notes for
 * @returns an array of Note objects
 */
function getNotesByUser(userID) {
    return conPro.query('SELECT * FROM Note WHERE userID = ?', [userID])
        .then(q => 
            q.results.map(r => new Note(r))
            );
}

/**
 * Get a list of 'suggested' (edited in the past week) notes
 * 
 * @param {number} userID the ID of the user to get suggestions for
 * @returns an array of Note objects
 */
function getSuggestedNotes(userID) {
    let oneWeekAgo = new Date().setDate(new Date().getDate() - 5);
    return conPro.query('SELECT * FROM Note WHERE userID = ? AND dateEdited > ?', [userID, oneWeekAgo])
        .then(q => q.results.map(r => new Note(r)));
}

/**
 * Get the note object for a specific note ID
 * 
 * @param {number} noteID the ID of the note to get information for
 * @returns the note, or undefined if no note with that ID was found
 */
function getNoteByID(noteID) {
    return conPro.query('SELECT * FROM Note WHERE noteID = ?', [noteID])
        .then(q => 
            q.results.length > 0 ? new Note(q.results[0]) : undefined
            );
}

/**
 * Set the title of an existing note
 * 
 * @param {number} noteID the ID of the note to set the title for
 * @param {string} title the new title to set
 * @returns a promise for the query
 */
function setNoteTitle(noteID, title) {
    return conPro.query('UPDATE Note SET title = ? WHERE noteID = ?', [title, noteID]);
}

/**
 * Delete a specific note from the notes table, then remove all tag associations
 * and note data associated with it.
 * 
 * @param {number} noteID the note ID to delete
 * @returns a promise for the query
 */
function deleteNote(noteID) {
    return conPro.query('DELETE FROM Note WHERE noteID = ?', [noteID])
        .then(() => conPro.query('DELETE FROM NoteData WHERE noteID = ?', [noteID]))
        .then(() => conPro.query('DELETE FROM NoteTag WHERE noteID = ?', [noteID]));
}

module.exports = {createNote, assignTags, getNotesByUser, getSuggestedNotes, getNoteByID, setNoteTitle, deleteNote};