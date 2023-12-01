/**
 * noteItems.js
 * 
 * Handles items in the 'jump back in' and notes list section
 */

import * as noteMenu from './noteMenu';
import Handlebars from 'handlebars';
import * as ns from '../common/js/noteState';
import * as util from '../common/js/util';
import * as sAndF from './sortAndFilter';

const noteListContent = document.getElementById("note-list-content");
const jump = document.getElementById("jump");

// Add a random ID for note menus to anchor to
Handlebars.registerHelper("randomID", () => {
    const charLibrary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    for (let i = 0; i < 20; i++) {
        let index = Math.round(Math.random() * charLibrary.length);
        id += charLibrary[index];
    }
    return id;
});

// Format a date object into a nice time
Handlebars.registerHelper("niceTime", dO => util.niceTime(dO));

// Get the preview URL for a given note
Handlebars.registerHelper("previewURL", note => {
    if (note.slideCount && note.slideCount > 0)
        return `/api/data/${note.noteID}/0/thumbnail`;
    else
        return '/home/placeholder.png';
})

/**
 * Template for rendering "Jump Back In" targets
 */
const jumpTargetTemplate = Handlebars.compile(
    `
    {{#this}}
    <div class="jump-target" data-noteid="{{noteID}}">
        <img src="{{previewURL this}}" class="jump-target-img"></img>
        <div class="jump-target-details">
            <div class="jump-target-details-text">
                <div class="jump-target-name">{{title}}</div>
                <div class="jump-target-why">Edited {{niceTime dateEdited}}</div>
            </div>
            <md-icon-button id="{{randomID}}" class="note-menu-button">
                <md-icon>more_vert</md-icon>
            </md-icon-button>
        </div>
        <md-ripple></md-ripple>
    </div>
    {{/this}}
    `
);

/**
 * Template for rendering items in the Your Notes list
 */
const noteListItemTemplate = Handlebars.compile(
    `
    {{#this}}
    <md-list-item type="button" data-noteid="{{noteID}}" data-tags="{{#tags}}{{this}};{{/tags}}">
        <div class="note-list-name" slot="headline">{{title}}</div>
        <div class="note-list-details" slot="supporting-text">
            <div class="note-list-details-item"><md-icon>history</md-icon> Edited {{niceTime dateEdited}}</div>
            {{#tags}}
            <div class="note-list-details-item"><md-icon>sell</md-icon> {{this.tagName}}</div>
            {{/tags}}
        </div>
        <img class="note-list-img" slot="start" src="{{previewURL this}}"></img>
        <md-icon-button id="{{randomID}}" slot="end" class="note-menu-button">
            <md-icon>more_vert</md-icon>
        </md-icon-button>
    </md-list-item>
    {{/this}}
    `
);

/**
 * Render the list of notes in the notes list section
 */
export function renderNotesList() {
    ns.getNotes().then(notes => {
        noteListContent.innerHTML = noteListItemTemplate(sAndF.sortAndFilter(notes));
        registerNoteItems(noteListContent.children);
    });
}

/**
 * Render the 'jump targets' in the jump back in sections
 */
export function renderJumpTargets() {
    ns.getSuggested().then(suggestions => {
        jump.innerHTML = jumpTargetTemplate(suggestions);
        registerNoteItems(jump.children);
    });
}

/**
 * Register onclick events for note items (in list or in jump)
 * @param {HTMLCollection} elements
 */
export function registerNoteItems(elements) {
    for (let elem of elements) {
        let noteID = Number.parseInt(elem.attributes.getNamedItem("data-noteid").textContent);
        elem.onclick = () => openNote(noteID);
        let dotsMenu = elem.querySelector(".note-menu-button");
        dotsMenu.onclick = ev =>  {
            noteMenu.open(noteID, dotsMenu.id);
            ev.stopPropagation();
        }
    }
}

/**
 * Navigate to a specific note ID
 * @param {number} noteID the note ID to navigate to
 */
export function openNote(noteID) {
    window.location.href = `/notes?noteid=${noteID}`;
}

renderNotesList();
renderJumpTargets();