/**
 * render.js
 * 
 * Handles filling the DOM with data form the API
 */

import Handlebars from 'handlebars'
import {getSuggestions, getNotesList, getSlideImage, getUserPicture, getUserEmail} from './api'
import { registerNoteItems, registerFilterChips } from './buttons';

export function render() {
    renderJumpTargets();
    renderNotesList();
    renderUserInfo();
}

/**
 * Change how the notes are sorted
 * 
 * @param filter one of [lastEdit, firstEdit, az, za]
 */
export function updateNotesSort(filter) {
    // allNotes.sort((a, b) => a.lastEdit - b.lastEdit)\
    noteListContent.innerHTML = noteListItemTemplate(allNotes);
    registerNoteItems(noteListContent.children);
}

Handlebars.registerHelper("randomID", () => {
    const charLibrary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    for (let i = 0; i < 20; i++) {
        let index = Math.round(Math.random() * charLibrary.length);
        id += charLibrary[index];
    }
    return id;
});

/**
 * Template for rendering "Jump Back In" targets
 */
const jumpTargetTemplate = Handlebars.compile(
    `
    {{#this}}
    <div class="jump-target" data-noteid="{{noteID}}">
        <img src="{{slideImg}}" class="jump-target-img"></img>
        <div class="jump-target-details">
            <div class="jump-target-details-text">
                <div class="jump-target-name">{{title}}</div>
                <div class="jump-target-why">{{reason}}</div>
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
            {{#tags}}
            <div class="note-list-details-item"><md-icon>sell</md-icon> {{this}}</div>
            {{/tags}}
        </div>
        <img class="note-list-img" slot="start" src="{{slideImg}}"></img>
        <md-icon-button id="{{randomID}}" slot="end" class="note-menu-button">
            <md-icon>more_vert</md-icon>
        </md-icon-button>
    </md-list-item>
    {{/this}}
    `
);

/**
 * Template for rendering the tag filter chips
 */
const filterTagTemplate = Handlebars.compile(
    `
    {{#this}}
    <md-filter-chip id="chip-downloaded" label="{{this}}">
        <md-icon slot="icon">sell</md-icon>
    </md-filter-chip>
    {{/this}}
    `
)

const jump = document.getElementById("jump");
function renderJumpTargets() {
    getSuggestions().then(async suggestions => {
        for (let s of suggestions) {
            s.slideImg = await getSlideImage(s.noteID, 1);
            s.reason = "Edited recently"
        }
        jump.innerHTML = jumpTargetTemplate(suggestions);
        registerNoteItems(jump.children);
    });
}

const noteListContent = document.getElementById("note-list-content");
const filters = document.getElementById("filters");
let allNotes;
async function renderNotesList() {
    // Get the notes and preview images
    allNotes = await getNotesList();
    for (let note of allNotes){
        note.slideImg = await getSlideImage(note.noteID, 1);
    }
    
    // Create the tag filters from the notes list
    let seen = []
    let allTags = allNotes.map(n => n.tags).flat().filter(t => {
        if (seen.includes(t))
            return false;

        seen.push(t);
        return true;
    });
    filters.innerHTML += filterTagTemplate(allTags);
    registerFilterChips();

    updateNotesSort("recent");
}

const userPicture = document.getElementById("user-picture")
const userMenuEmail = document.getElementById("user-menu-email")
async function renderUserInfo() {
    userPicture.src = await getUserPicture();
    userMenuEmail.innerText = await getUserEmail();
}