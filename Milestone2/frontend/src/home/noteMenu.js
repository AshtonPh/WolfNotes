/**
 * noteMenu.js
 * 
 * Handles actions for context menu for notes
 */

/** The Note ID this note menu was opened for */
let activeNoteID;

import {MdMenu} from '@material/web/menu/menu';
import * as DeleteDialog from './deleteDialog';
import * as NewPropertiesDialog from './newPropertiesDialog';

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
export function open(noteID, anchorID) {
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