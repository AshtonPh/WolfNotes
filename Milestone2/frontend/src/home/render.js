/**
 * render.js
 * 
 * Handles filling the DOM with data form the API
 */

import Handlebars from 'handlebars'
import * as ns from '../common/js/noteState'
import * as ts from '../common/js/tagState'
import { Note, Tag } from '../common/js/models'
import { registerNoteItems, registerTagChips } from './buttons';
import * as util from '../common/js/util';

export const sortTypes = [
    {id: 'mostrecent', niceName: 'Most Recent', sorter: (n1, n2) => n2.dateEdited - n1.dateEdited},
    {id: 'az', niceName: 'A to Z', sorter: (n1, n2) => n1.title - n2.title},
]

export function render() {
    renderJumpTargets();
    renderNotesList();
    renderTagChips();
    renderUserInfo();
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

Handlebars.registerHelper("niceTime", dO => util.niceTime(dO));

Handlebars.registerHelper("previewURL", note => {
    if (note.slideCount > 0)
        return `/api/data/${note.noteID}/1/thumbnail`;
    else
        return ``; // TODO: Placeholder image
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
    <md-assist-chip id="chip-sorting" label="Most recent" data-currentsort="mostrecent">
        <md-icon slot="icon">sort</md-icon>
    </md-assist-chip>
    {{#this}}
    <md-filter-chip data-filter-id="{{tagID}}" label="{{tagName}}">
        <md-icon slot="icon">sell</md-icon>
    </md-filter-chip>
    {{/this}}
    `
)

const propertiesTagTemplate = Handlebars.compile(
    `
    {{#this}}
    <md-filter-chip label="{{tagName}}" data-tag-id="{{tagID}}">
        <md-icon slot="icon">sell</md-icon>
    </md-filter-chip>
    {{/this}}
    `
)

const jump = document.getElementById("jump");
export function renderJumpTargets() {
    ns.getSuggested().then(suggestions => {
        jump.innerHTML = jumpTargetTemplate(suggestions);
        registerNoteItems(jump.children);
    });
}

const noteListContent = document.getElementById("note-list-content");
const filters = document.getElementById("filters");
export function renderNotesList() {
    let filterChips = filters.querySelectorAll('md-filter-chip');
    let activeFilters = Array.from(filterChips)
        .filter(n => n.selected)
        .map(n => Number.parseInt(n.attributes.getNamedItem('data-filter-id').value));

    ns.getNotes().then(notes => {
        let toRender = notes
            .filter(n => activeFilters.every(tID => n.tags.some(t => t.tagID == tID)));

        let sortChip = document.getElementById('chip-sorting');
        let sorter;
        if (sortChip) {
            sorter = sortTypes
                .find(s => s.id == sortChip.attributes.getNamedItem('data-currentsort').textContent)
        }
        if (sorter === undefined) 
            sorter = sortTypes[0];

        noteListContent.innerHTML = noteListItemTemplate(toRender);
        registerNoteItems(noteListContent.children);
    });
}

export function renderTagChips() {
    ts.getTags().then(tags => {
        filters.innerHTML += filterTagTemplate(tags)
        registerTagChips();
        document.getElementById('properties-tags').innerHTML = 
        document.getElementById('newnote-tags').innerHTML =
            propertiesTagTemplate(tags);
    });
}
    

const userPicture = document.getElementById("user-picture")
const userMenuEmail = document.getElementById("user-menu-email")
async function renderUserInfo() {
    userPicture.src = await getUserPicture();
    userMenuEmail.innerText = await getUserEmail();
}