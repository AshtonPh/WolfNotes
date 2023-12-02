/**
 * offlineState.js
 * 
 * Handles downloading notes to the indexed db for offline viewing
 */

import { Note } from './models';
import * as api from './api';

const IDB_VERSION = 1;

const IDB_NAME = 'OfflineNotesDB';

let getDBPromise;

/** @type {IDBDatabase} */
let database;

/**
 * @returns {Promise<IDBDatabase>}
 */
function getDB() {
    if (!getDBPromise) {
        getDBPromise = new Promise((res, rej) => {
            let request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
            request.onsuccess = ev => {
                database = ev.target.result;
                res(database);
            };
            request.onerror = ev => {
                rej(ev.target.errorCode);
            };
            request.onupgradeneeded = initOfflineDB;
        });
    }
    return getDBPromise;
}

function initOfflineDB(ev) {
    /** @type {IDBDatabase} */
    let db = ev.target.result;
    db.createObjectStore('notes', { keyPath: 'id' });
}

/**
 * Check if the database contains any offline notes
 * @returns {Promise<boolean>} true if there's any offline notes in the database
 */
export async function anyOfflineNotes() {
    let databases = await window.indexedDB.databases();
    let dbExists = databases.some(d => d.name == IDB_NAME && d.version == IDB_VERSION);
    if (!dbExists)
        return false;

    let db = await getDB();
    let ta = db.transaction('notes', 'readonly');
    let os = ta.objectStore('notes');
    return await new Promise((res, _rej) => {
        os.count().onsuccess = ev => res(ev.target.result > 0);
    });
}

/**
 * Get the list of note IDs currently in the offline database.
 * This is faster than getNotes and should be used in any situation where
 * only the IDs are needed.
 * 
 * @returns {Promise<number[]>} the list of note IDs in the offline database
 */
export async function getIDs() {
    let db = await getDB();
    let ta = db.transaction('notes', 'readonly');
    let os = ta.objectStore('notes');
    return await new Promise((res, rej) => {
        os.getAllKeys().onsuccess = ev => {
            res(ev.target.result);
        };
    })
}

/**
 * Get the list of notes currently in the offline database
 * 
 * @returns {Promise<Note[]>} a list of notes
 */
export async function getNotes() {
    let db = await getDB();
    let ta = db.transaction('notes', 'readonly');
    let os = ta.objectStore('notes');
    return await new Promise((res, rej) => {
        os.getAll().onsuccess = ev => {
            let items = ev.target.result;
            res(items.map(i => Note.fromJson(i.meta)));
        };
    });
}

/**
 * Get a note object and a list of chunks from the offline database
 * 
 * @param {number} noteID the ID to find
 * @returns {Promise<{note: Note, chunks: {slideNumber: number, contents: string}[]}>}
 */
export async function getNoteAndChunks(noteID) {
    let db = await getDB();
    let ta = db.transaction('notes', 'readonly');
    let os = ta.objectStore('notes');
    return await new Promise((res, rej) => {
        os.get(noteID).onsuccess = ev => {
            let noteItem = ev.target.result;
            if (noteItem == undefined)
                res(undefined);

            res({
                note: Note.fromJson(noteItem.meta),
                chunks: noteItem.chunks
            });
        };
    });
}

/**
 * Download a note to the offline database
 * 
 * @param {Note} note the note to add to the offline database
 */
export async function download(note) {
    // Download the note chunks from the API
    let request = await api.req(`/data/${note.noteID}/chunks`);
    let chunks;
    if (request.ok)
        chunks = await request.json();
    else if (request.status == 404)
        // 404 indicates a note with no chunks saved yet
        chunks = [];
    else
        // Fail
        console.log(`Failed to download ${note.title} for offline viewing: ${request.status}`);

    let db = await getDB();
    let ta = db.transaction('notes', 'readwrite');
    await new Promise((res, rej) => {
        ta.oncomplete = () => res();
        ta.onerror = () => rej();
        let os = ta.objectStore('notes')
        os.add({
            'id': note.noteID,
            'meta': note,
            'chunks': chunks
        });
    })
}

/**
 * Remove a note from the offline database
 * 
 * @param {number} noteID the ID of the note to remove
 */
export async function purge(noteID) {
    let db = await getDB();
    let ta = db.transaction('notes', 'readwrite');
    await new Promise((res, rej) => {
        ta.oncomplete = () => res();
        ta.onerror = () => rej();
        let os = ta.objectStore('notes')
        os.delete(noteID);
    })
}

/**
 * Remove notes that no longer exist from the offline database
 * 
 * @param {number[]} noteIDs A list of valid note IDs
 */
export async function prune(noteIDs) {
    let toPrune = (await getIDs()).filter(i => !noteIDs.includes(i));
    toPrune.forEach(i => {
        purge(i);
    });
}

/**
 * Update any offline notes that are out of date from their server version
 * 
 * @param {Note[]} notes The current notes list 
 */
export async function update(notes) {
    await prune(notes.map(n => n.noteID));
    let offlineNotes = await getNotes();
    let staleNotes = offlineNotes
        .map(oN => ({ offline: oN, server: notes.find(n => n.noteID == oN.noteID) }))
        .filter(n =>
            n.offline.title != n.server.title ||
            n.offline.dateEdited != n.server.dateEdited ||
            n.offline.tags.length != n.server.tags.length ||
            n.offline.tags.some(t => {
                let equalTag = n.server.tags.find(t2 => t2.tagID == t.tagID)
                if (!equalTag) return true;
                else return equalTag.tagName != t.tagName;
            }));
    staleNotes.forEach(async n => {
        await purge(n.offline.noteID);
        await download(n.server);
    });
}

export async function clearAll() {
    if (await anyOfflineNotes()) {
        await new Promise((res, rej) => {
            let e = window.indexedDB.deleteDatabase(IDB_NAME);
            e.onsuccess = e.onerror = () => res();
        });
    }
}
