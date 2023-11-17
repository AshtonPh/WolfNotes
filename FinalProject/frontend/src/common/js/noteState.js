/**
 * noteState.js
 * 
 * Handles grabbing data from the API and keeping track of local state
 */

import * as api from './api';
import { Note, Tag } from './models';
import * as ts from './tagState';

/**
 * The current set of Note objects
 * @type {Note[]}
 */
let noteSet;

let noteSetInitializedPromise;

function initializeNoteSet() {
    if (!noteSetInitializedPromise) {
        noteSetInitializedPromise = new Promise((resolve, reject) => {
            api.req('/notes/all')
                .then(res => Promise.all([res.json(), ts.getTags()]))
                .then(rt => {
                    let [res, tags] = rt;
                    noteSet = res
                        .map(note => {
                            let newNote = Note.fromApi(note);
                            newNote.tags = tags.filter(t => note.tags.includes(t.tagID));
                            return newNote;
                        });
                    resolve();
                }).catch(reason => reject(reason));
        });
    }
    return noteSetInitializedPromise;
}

/**
 * @returns {Promise<Note[]>}
 */
export function getNotes() {
    return initializeNoteSet().then(() => noteSet);
}

/**
 * @returns {Promise<Note[]>}
 */
export function getSuggested() {
    return initializeNoteSet()
        .then(() => api.req('/notes/suggested'))
        .then(res => res.json())
        .then(res => noteSet.filter(n => res.includes(n.noteID)));
}

/** @returns {Promise<Note>} */
export function getNote(noteID) {
    // If the client has already requested all notes, just get it from the note set
    if (noteSetInitializedPromise) {
        return initializeNoteSet()
            .then(() => noteSet.find(n => n.noteID == noteID))
    }
    // If this happens before the client requests all notes, then get the single note's data from the API
    else {
        return api.req(`/notes/${noteID}`)
            .then(res => res.json())
            .then(res => Note.fromApi(res));
    }
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
        body: JSON.stringify({ title, tags }),
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(() => ts.getTags())
        .then(allTags => {
            note.title = title;
            note.tags = allTags.filter(t => tags.includes(t.tagID));
        });
}

/**
 * 
 * @param {Note} note 
 * @returns {Promise}
 */
export function deleteNote(note) {
    initializeNoteSet().then(() =>
        api.req(`/notes/${note.noteID}`, {
            method: 'DELETE',
        })
    )
    .then(() => noteSet = noteSet.filter(n => n.noteID != note.noteID));
}

export function createNote(title, tags) {
    return api.req(`/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, tags }),
    })
        .then(res => res.json())
        .then(res => res.noteID);
}

export function addSlideSet(noteID, buffer) {
    let data = new FormData();
    data.append('pdf', buffer);
    return api.req(`/data/${noteID}`, {
        method: 'POST',
        body: data
    })
}

export function processTagDeletion(tagID) {
    if (noteSet) {
        noteSet.forEach(note => {
            note.tags.filter(t => t != tagID);
        });
    }
}

export function invalidateState() {
    noteSet = undefined;
    noteSetInitializedPromise = undefined;
}
