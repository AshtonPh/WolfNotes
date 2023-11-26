/**
 * newPropertiesDialog.js
 * 
 * Handles the new note and note properties dialog.
 * The same file handles both of these because they function similarly.
 */

import '@material/web/chips/chip-set'
import { MdChipSet } from '@material/web/chips/chip-set';
import * as NoteItems from './noteItems';
import * as ns from '../common/js/noteState';
import * as ts from '../common/js/tagState';
import * as lb from './loadingBlock';

import Handlebars from 'handlebars'

const propertiesTagTemplate = Handlebars.compile(
    `
    {{#this}}
    <md-filter-chip label="{{tagName}}" data-tag-id="{{tagID}}">
        <md-icon slot="icon">sell</md-icon>
    </md-filter-chip>
    {{/this}}
    `
);

/**
 * The note ID the properties dialog is operating on
 * @type {number}
 */
let activeNoteID;

export function openPropertiesDialog(noteID) {
    activeNoteID = noteID;
    ns.getNote(noteID).then(note => {
        // Fill existing information for the selected note
        propertiesNameField.value = note.title;
        for (let tElem of propertiesTags.children) {
            let tagID = tElem.attributes.getNamedItem('data-tag-id').textContent;
            tElem.selected = note.tags.some(t => t.tagID == tagID);
        }
        propertiesDialog.show();
    });
}

function renderTags() {
    ts.getTags().then(tags => {
        propertiesTags.innerHTML = newNoteTags.innerHTML = propertiesTagTemplate(tags);
    });
}

/**
 * Extract the selected tags from a chipset.
 * 
 * @param {MdChipSet} rootElement the chipset the chips belong to
 * @returns {[]} a mixed array of numbers (for existing tags) and strings (for new tags)
 */
function getTagsFromChips(rootElement) {
    let tags = [];
    for (let tElem of rootElement.children) {
        if (tElem.selected)
            tags.push(Number.parseInt(tElem.attributes.getNamedItem('data-tag-id').textContent));
    }
    return tags;
}

function confirmPropertySave() {
    if (!propertiesNameField.reportValidity())
        return;

    let newName = propertiesNameField.value;
    let tags = getTagsFromChips(propertiesTags);

    confirmPropertyBtn.disabled = true;
    lb.show();
    ns.getNote(activeNoteID)
        .then(note => ns.setNoteInformation(note, newName, tags))
        .then(() => {
            confirmPropertyBtn.disabled = false;
            lb.hide();
            propertiesDialog.close();
            NoteItems.renderJumpTargets();
            NoteItems.renderNotesList();
        });
}

/**
 * 
 * @returns 
 */
function confirmCreate() {
    if (!newNoteNameField.reportValidity())
        return;

    let newName = newNoteNameField.value;
    let tags = getTagsFromChips(newNoteTags);

    lb.show();
    ns.createNote(newName, tags)
        .then(nID => {
            if (newNoteSlides.files && newNoteSlides.files[0]) {
                ns.addSlideSet(nID, newNoteSlides.files[0])
                    .then(() => NoteItems.openNote(nID));
            }
            else {
                NoteItems.openNote(nID);
            }
        });
}

// Create dialog elements
const confirmCreateBtn = document.getElementById('confirm-create-btn')
const cancelCreateBtn = document.getElementById('cancel-create-btn');
const createDialog = document.getElementById('create-new-dialog');
const newNoteNameField = document.getElementById('new-note-name');
const newNoteTags = document.getElementById('new-note-tags');
const newNoteSlides = document.getElementById('new-note-slides');

// Properties elements
const confirmPropertyBtn = document.getElementById('confirm-properties-btn')
const cancelPropertyBtn = document.getElementById('cancel-properties-btn');
const propertiesDialog = document.getElementById('properties-dialog');
const propertiesNameField = document.getElementById('properties-note-name');
const propertiesTags = document.getElementById('properties-tags');

// Assign button actions
confirmCreateBtn.onclick = confirmCreate;
cancelCreateBtn.onclick = () => createDialog.close();
confirmPropertyBtn.onclick = confirmPropertySave;
cancelPropertyBtn.onclick = () => propertiesDialog.close();
document.getElementById('create-note-btn').onclick = () => createDialog.show();

renderTags();