/**
 * deleteDialog.js
 * 
 * Handles displaying the delete dialog and deleting notes
 */

import {MdDialog} from '@material/web/dialog/dialog';
import * as ns from '../common/js/noteState'
import * as NoteItems from './noteItems';

/**
 * @type {MdDialog}
 */
const deleteDialog = document.getElementById('confirm-delete-dialog');
const confirmDeleteButton = document.getElementById('confirm-delete-btn');
const cancelDeleteButton = document.getElementById('cancel-delete-btn');

/**
 * The note ID the delete dialog is open for
 */
let activeNoteID;

export function open(noteID) {
    activeNoteID = noteID;
    deleteDialog.show();
}

function confirmDelete() {
    confirmDeleteButton.disabled = true;
    cancelDeleteButton.disabled = true;
    ns.getNote(activeNoteID)
        .then(note => ns.deleteNote(note))
        .then(() => {
            confirmDeleteButton.disabled = false;
            cancelDeleteButton.disabled = false;
            deleteDialog.close();
            NoteItems.renderJumpTargets();
            NoteItems.renderNotesList();
        });
}

confirmDeleteButton.onclick = confirmDelete;
cancelDeleteButton.onclick = () => deleteDialog.close();
