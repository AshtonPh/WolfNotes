/**
 * buttons.js
 * 
 * Handle click events for page buttons
 */

import * as ns from '../common/js/noteState'
import * as api from '../common/js/api'
import { render, renderNotesList, sortTypes } from './render';

let noteMenu, deleteDialog, confirmDeleteButton, cancelDeleteButton, 
    notesListContent, createDialog, newNoteName, confirmCreateBtn, cancelCreateBtn,
    sortMenu, propertiesDialog, notePropertyName, confirmSavePropertiesButton,
    cancelSavePropertiesButton;

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
    createDialog = document.getElementById('create-new-dialog');
    confirmCreateBtn = document.getElementById('confirm-create-btn');
    cancelCreateBtn = document.getElementById('cancel-create-btn');
    newNoteName = document.getElementById('new-note-name');
    sortMenu = document.getElementById('sort-menu');
    propertiesDialog = document.getElementById('properties-dialog');
    notePropertyName = document.getElementById('properties-note-name');
    confirmSavePropertiesButton = document.getElementById('confirm-propsave-btn');
    cancelSavePropertiesButton = document.getElementById('cancel-propsave-btn');

    // Make the user picture open the user menu
    const userMenu = document.getElementById('user-menu');
    const userPicture = document.getElementById('user-picture');
    userPicture.onclick = (ev) => {
        userMenu.open = !userMenu.open;
        ev.stopPropagation();
    }
    document.getElementById('um-logout').onclick = () => {
        api.req('/auth/signout', {method: 'POST'}).then(() => document.location.href = "/signin")
    }

    // Add actions to the note menu
    document.getElementById("nm-btn-delete").onclick = openDeleteDialog;
    document.getElementById("nm-btn-properties").onclick = openPropertiesDialog;

    // Add actions to sort menu
    for (let e of document.getElementById('sort-menu').children)
        e.onclick = () => setSort(e);

    // Add actions to the delete dialog
    confirmDeleteButton.onclick = confirmDelete;
    cancelDeleteButton.onclick = () => deleteDialog.close();

    // Add actions to the properties dialog
    confirmSavePropertiesButton.onclick = confirmPropertySave;
    cancelSavePropertiesButton.onclick = () => propertiesDialog.close();

    // Add actions for creating a note
    document.getElementById('create-note-btn').onclick = () => createDialog.show();
    confirmCreateBtn.onclick = confirmCreate;
    cancelCreateBtn.onclick = () => createDialog.close();
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
export function registerTagChips() {
    document.getElementById('chip-sorting').onclick = openSortMenu;
    sortMenu.anchorID = 'chip-sorting';
    let chips = document.querySelectorAll("#filters md-filter-chip");
    for (let chip of chips) {
        // This setTimeout is a workaround for the filter chips
        //  sometimes updating their state slightly slower than
        //  they fire the onclick event
        chip.onclick = () => setTimeout(renderNotesList, 100);
    }
}

function openNote(noteID) {
    window.location.href = `/notes?noteid=${noteID}`;
}

function openNoteMenu(ev, noteID, anchorID) {
    let forAttr = noteMenu.attributes.getNamedItem("data-for");
    forAttr.textContent = noteID;
    noteMenu.anchor = anchorID;

    if (!noteMenu.open)
        noteMenu.open = true;

    ev.stopPropagation();
}

function openSortMenu() {
    sortMenu.open = !sortMenu.open;
}

function setSort(elem) {
    let sortType = elem.attributes.getNamedItem("data-sorttype").textContent;
    document.getElementById('chip-sorting').attributes.getNamedItem('data-currentsort').textContent = sortType;
    document.getElementById('chip-sorting').attributes.getNamedItem('label').textContent =
        sortTypes.find(t => t.id == sortType).niceName;
    renderNotesList();
}

function openDeleteDialog() {
    let nmForAttr = noteMenu.attributes.getNamedItem("data-for");
    let diagForAttr = deleteDialog.attributes.getNamedItem("data-for");
    diagForAttr.textContent = nmForAttr.textContent;
    deleteDialog.show();
}

function openPropertiesDialog() {
    let nmForAttr = noteMenu.attributes.getNamedItem("data-for");
    let diagForAttr = propertiesDialog.attributes.getNamedItem("data-for");
    diagForAttr.textContent = nmForAttr.textContent;
    ns.getNote(Number.parseInt(nmForAttr.textContent)).then(note => {
        document.getElementById('properties-note-name').value = note.title;
        for (let tElem of document.getElementById('properties-tags').children) {
            let tagID = tElem.attributes.getNamedItem('data-tag-id').textContent;
            tElem.selected = note.tags.some(t => t.tagID == tagID);
        }
        propertiesDialog.show();
    });
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

async function confirmCreate() {
    if (!newNoteName.reportValidity())
        return;

    let newName = newNoteName.value;
    let tags = [];
    for (let tElem of document.getElementById('newnote-tags').children) {
        if (!tElem.selected)
            continue;

        tags.push(Number.parseInt(tElem.attributes.getNamedItem('data-tag-id').textContent));
    }
    ns.createNote(newName, tags).then(nID => {
        if (document.getElementById('new-note-slides').files && 
            document.getElementById('new-note-slides').files[0]) {
                let data = new FormData();
                data.append('pdf', document.getElementById('new-note-slides').files[0]);
                api.req(`/data/${nID}`, {
                    method: 'POST',
                    body: data
                })
                .then(() => openNote(nID));
            }
            else {
                openNote(nID);
            }
    });
}

function confirmPropertySave() {
    if (!notePropertyName.reportValidity())
        return;

    let diagForAttr = propertiesDialog.attributes.getNamedItem("data-for");
    let newName = notePropertyName.value;
    let tags = [];
    for (let tElem of document.getElementById('properties-tags').children) {
        if (!tElem.selected)
            continue;

        tags.push(Number.parseInt(tElem.attributes.getNamedItem('data-tag-id').textContent));
    }

    confirmSavePropertiesButton.disabled = true;
    ns.getNote(diagForAttr.textContent)
        .then(note => ns.setNoteInformation(note, newName, tags))
        .then(() => {
            confirmSavePropertiesButton.disabled = false;
            propertiesDialog.close();
            render();
        });

}