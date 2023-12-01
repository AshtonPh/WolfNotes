/**
 * downloadManager.js
 * 
 * Handles the download queue and download status bar 
 */

import * as os from '../common/js/offlineState';
import * as ns from '../common/js/noteState';
import { Note } from '../common/js/models';

/** @type {Promise} */
let promise;

const statusBar = document.getElementById('download-status-bar');

let downloadCompleteTimeout;

/** @type {number[]} */
let offlineNotes;

/**
 * Enqueue a new download action to the download queue
 * 
 * @param {string} message The message to show on the download status bar
 * @param {() => Promise} action the async action to execute
 */
function enqueue(runningMessage, doneMessage, action) {
    if (!promise) {
        promise = runAction(runningMessage, doneMessage, action);
    }
    else {
        promise = promise.then(() => runAction(runningMessage, doneMessage, action));
    }
}

async function runAction(runningMessage, doneMessage, action) {
    showStatus(runningMessage);
    await action();
    hideStatus(doneMessage);
}

function showStatus(message) {
    clearTimeout(downloadCompleteTimeout);
    statusBar.innerText = message;
    statusBar.classList.add('open');
}

function hideStatus(message) {
    statusBar.innerText = message;
    downloadCompleteTimeout = 
        setTimeout(() => statusBar.classList.remove('open'), 2500)
}

/**
 * Get the list of offline-available note IDs
 * 
 * @returns {Promise<number[]>} a list of note IDs available offline
 */
export async function getOfflineNoteIDs() {
    if (!offlineNotes) {
        offlineNotes = await os.anyOfflineNotes() ? await os.getIDs() : [];
    }
    return offlineNotes;
}

/**
 * Download a note for offline viewing
 * 
 * @param {Note} note 
 */
export async function download(note) {
    await getOfflineNoteIDs();
    if (offlineNotes.includes(note.noteID))
        return;
    
    offlineNotes.push(note.noteID);
    enqueue(`Downloading "${note.title}"`, `"${note.title}" downloaded`, () => os.download(note));
}

/**
 * Remove a note from the offline database
 * 
 * @param {Note} note 
 */
export async function purge(note) {
    await getOfflineNoteIDs();
    if (!offlineNotes.includes(note.noteID))
        return;

    offlineNotes = offlineNotes.filter(nID => nID != note.noteID);
    enqueue(`Removing "${note.title}"`, `"${note.title}" removed`, () => os.purge(note.noteID));
}

async function updateNotes() {
    if (await os.anyOfflineNotes()) {
        let notes = await ns.getNotes();
        enqueue('Updating your offline notes', 'Your offline notes are up-to-date', () => os.update(notes));
    }
}

// Update notes on page load
updateNotes();
