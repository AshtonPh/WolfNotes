/**
 * noteMenu.js
 * 
 * Handles actions for context menu for notes
 */

const downloadBtn = document.getElementById('nm-btn-download');
const purgeBtn = document.getElementById('nm-btn-purge');

/** The Note ID this note menu was opened for */
let activeNoteID;

import {MdMenu} from '@material/web/menu/menu';
import * as DeleteDialog from './deleteDialog';
import * as NewPropertiesDialog from './newPropertiesDialog';
import * as DownloadManager from './downloadManager';
import * as ns from '../common/js/noteState';

/**
 * The note menu element
 * @type {MdMenu}
 */
const noteMenu = document.getElementById('note-menu');

/**
 * 
 * @param {number} noteID the note ID to open a menu for
 * @param {string} anchorID the ID of the 3 dots menu to anchor to
 */
export async function open(noteID, anchorID) {
    let isOffline = (await DownloadManager.getOfflineNoteIDs()).includes(noteID);
    if (isOffline) {
        downloadBtn.style.display = 'none';
        purgeBtn.style.display = 'block';
    }
    else {
        downloadBtn.style.display = 'block';
        purgeBtn.style.display = 'none';
    }
    activeNoteID = noteID;
    noteMenu.anchor = anchorID;
    noteMenu.open = true;
}

/**
 * Check if the note menu is open
 * @returns true if the note menu is open
 */
export const isOpen = () => noteMenu.isOpen;

document.getElementById("nm-btn-delete").onclick = () => DeleteDialog.open(activeNoteID);
document.getElementById("nm-btn-properties").onclick = () => NewPropertiesDialog.openPropertiesDialog(activeNoteID);
downloadBtn.onclick = async () => DownloadManager.download(await ns.getNote(activeNoteID));
purgeBtn.onclick = async () => DownloadManager.purge(await ns.getNote(activeNoteID));