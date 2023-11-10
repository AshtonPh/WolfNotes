/**
 * noteState.js
 * 
 * Handles grabbing data from the API and keeping track of local state
 */

import * as api from'./api';
import {Note, Tag} from './models';

/**
 * The current set of Note objects
 * @type {Note[]}
 */
let noteSet;

/** True if the note set contains all notes */
let noteSetComplete = false;

/**
 * @returns {Promise<Note[]>}
 */
export function getNotes() {
    return new Promise((resolve, reject) => {
        if (noteSetComplete && noteSet) {
            resolve(noteSet);
        }
        else {
            api.req('/notes/all').then(res => {
                noteSet = res.json().map(note => Note.fromApi(note));
                noteSetComplete = true;
                resolve(noteSet);
            }).catch(reason => reject(reason));
        }
    });
}

/**
 * @returns {Promise<Note[]>}
 */
export function getSuggested() {
    return new Promise((resolve, reject) => {
        if (noteSetComplete && noteSet) {
            resolve(noteSet);
        }
        else {
            api.req('/notes/suggested').then(res => {
                let nIDs = res.map(noteData => noteData.noteID);
                getNotes().then(notes => notes.filter(n => nIDs.includes(n.noteID)));
            }).catch(reason => reject(reason));
        }
    });
}

/** @returns {Promise<Note>} */
export function getNote(noteID) {
    return new Promise((resolve, reject) => {
        let note = noteSet.find(n => n.noteID == noteID);
        if (note) {
            resolve(note);
        }
        else {
            api.req(`/notes/${noteID}`).then(noteData => {
                note = Note.fromApi(noteData);
                noteSet.push(note);
                resolve(note);
            }).catch(reason => reject(reason));
        }
    });
}

/**
 * 
 * @param {Note} note 
 * @param {string} title 
 * @param {number[]} tags 
 * @returns {Promise}
 */
export function setNoteInformation(note, title, tags) {
    return api.req(`/notes/${note.noteID}`, {
        body: JSON.stringify({title, tags}),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        note.title = title;
        note.tags = tags;
    });
}

/**
 * 
 * @param {Note} note 
 * @returns {Promise}
 */
export function deleteNote(note) {
    return api.req(`/notes/${note.noteID}`), {
        method: 'DELETE',
    }.then(() => {
        noteSet.filter(n => n != note);
    });
}

export function processTagDeletion(tagID) {
    noteSet.forEach(note => {
        note.tags.filter(t => t != tagID);
    });
}