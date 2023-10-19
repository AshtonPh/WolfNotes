/**
 * buttons.js
 * 
 * Handle click events for page buttons
 */

import { deleteNote } from "./api";

let noteMenu, deleteDialog, confirmDeleteButton, cancelDeleteButton, notesListContent;

/**
 * Register onclick events for static (non-rendered) button items
 */
export function registerButtons() {
    // Grab elements needed by button actions
    noteMenu = document.getElementById('note-menu');
    deleteDialog = document.getElementById('confirm-delete-dialog');
    confirmDeleteButton = document.getElementById('confirm-delete-btn');
    cancelDeleteButton = document.getElementById('cancel-delete-btn');
    notesListContent = document.getElementById('note-list-content');

    // Make the user picture open the user menu
    const userMenu = document.getElementById('user-menu');
    const userPicture = document.getElementById('user-picture');
    userPicture.onclick = (ev) => {
        userMenu.open = !userMenu.open;
        ev.stopPropagation();
    }

    // Add actions to the note menu
    document.getElementById("nm-btn-delete").onclick = openDeleteDialog;

    // Add actions to the delete dialog
    confirmDeleteButton.onclick = confirmDelete;
    cancelDeleteButton.onclick = () => deleteDialog.close();
}

/**
 * Register onclick events for note items (in list or in jump)
 */
export function registerNoteItems(elements) {
    for (let elem of elements) {
        let noteID = elem.attributes.getNamedItem("data-noteid").textContent;
        elem.onclick = () => openNote(noteID);
        let dotsMenu = elem.querySelector(".note-menu-button");
        dotsMenu.onclick = ev => openNoteMenu(ev, noteID, dotsMenu.id);
    }
}

/**
 * Register onclick events for filter chips
 */
export function registerFilterChips() {
    let chips = document.querySelectorAll("#filters md-filter-chip");
    for (let chip of chips) {
        chip.onclick = () => updateFilter(chip.label, chip.selected);
    }
}

function openNote(noteID) {
    window.location.href = `/note?noteid=${noteID}`;
}

function openNoteMenu(ev, noteID, anchorID) {
    let forAttr = noteMenu.attributes.getNamedItem("data-for");
    forAttr.textContent = noteID;
    noteMenu.anchor = anchorID;

    if (!noteMenu.open)
        noteMenu.open = true;

    ev.stopPropagation();
}

function openDeleteDialog() {
    let nmForAttr = noteMenu.attributes.getNamedItem("data-for");
    let diagForAttr = deleteDialog.attributes.getNamedItem("data-for");
    diagForAttr.textContent = nmForAttr.textContent;
    deleteDialog.show();
}

async function confirmDelete() {
    confirmDeleteButton.disabled = true;
    cancelDeleteButton.disabled = true;
    let diagForAttr = deleteDialog.attributes.getNamedItem("data-for");
    await deleteNote(diagForAttr.textContent);
    confirmDeleteButton.disabled = false;
    cancelDeleteButton.disabled = false;
    deleteDialog.close();
}

let filters = []
function updateFilter(tag, on) {
    // This onclick triggers before the selected property is updated,
    //  so use the opposite of the on value
    if (!on && !filters.includes(tag))
        filters.push(tag);
    else if (on && filters.includes(tag))
        filters.pop(tag);

    if (filters.length == 0) {
        for (let n of notesListContent.children)
            n.style.display = "flex";
    }
    else for (let n of notesListContent.children) {
        let tagsAttr = n.attributes.getNamedItem("data-tags");
        let tags = tagsAttr.textContent.split(';');
        if (filters.find(f => !tags.includes(f)) !== undefined)
            n.style.display = "none";
        else
            n.style.display = "flex";
    }
}