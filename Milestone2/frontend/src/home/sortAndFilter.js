/**
 * sortAndFilter.js
 * 
 * Handle click events for the sort/filter chips above the notes list
 * and handle the actual sorting/filtering.
 */

import Handlebars from 'handlebars'
import { renderNotesList } from './noteItems';
import * as ts from '../common/js/tagState';

const sortMenu = document.getElementById('sort-menu');
const filters = document.getElementById('filters');

/**
 * A list of sort types to use.
 * Format: 
 * @type {[{id: string, niceName: string, icon: string, sorter: function}]}
 */
export const sortTypes = [
    {id: 'mostrecent', niceName: 'Most Recently Edited', icon: 'history', sorter: (n1, n2) => n2.dateEdited - n1.dateEdited},
    {id: 'leastrecent', niceName: 'Least Recently Edited', icon: 'update', sorter: (n1, n2) => n1.dateEdited - n2.dateEdited},
    {id: 'az', niceName: 'A to Z', icon: 'sort_by_alpha', sorter: (n1, n2) => n1.title.localeCompare(n2.title)},
]

/**
 * The current sort type to use. Defaults to the first in the sortTypes array.
 */
let currentSortType = sortTypes[0];

/**
 * Template for rendering the tag filter chips
 */
const filterTagTemplate = Handlebars.compile(
    `
    <md-assist-chip id="chip-sorting" label="Most Recently Edited" data-currentsort="mostrecent">
        <md-icon slot="icon">sort</md-icon>
    </md-assist-chip>
    {{#this}}
    <md-filter-chip data-filter-id="{{tagID}}" label="{{tagName}}">
        <md-icon slot="icon">sell</md-icon>
    </md-filter-chip>
    {{/this}}
    `
);

const sortMenuEntriesTemplate = Handlebars.compile(
    `
    {{#this}}
    <md-menu-item data-sorttype="{{id}}">
        <md-icon slot="start">{{icon}}</md-icon>
        <div slot="headline">{{niceName}}</div>
    </md-menu-item>
    {{/this}}
    `
);

function renderSortList() {
    sortMenu.innerHTML = sortMenuEntriesTemplate(sortTypes);
    for (let e of sortMenu.children) {
        let sortTypeId = e.attributes.getNamedItem("data-sorttype").textContent;
        let sortType = sortTypes.find(sT => sT.id == sortTypeId);
        e.onclick = () => setSort(sortType);
    }
}

/**
 * 
 * @param {sortTypes[0]} sortType 
 */
function setSort(sortType) {
    document.getElementById('chip-sorting').attributes.getNamedItem('label').textContent = sortType.niceName;
    currentSortType = sortType;
    renderNotesList();
}

function renderTagChips() {
    ts.getTags().then(tags => {
        filters.innerHTML = filterTagTemplate(tags)
        registerTagChips();
    });
}

/**
 * Register onclick events for filter chips
 */
function registerTagChips() {
    document.getElementById('chip-sorting').onclick = openSortMenu;
    document.getElementById('chip-sorting').attributes.getNamedItem('label').textContent = currentSortType.niceName;
    sortMenu.anchorID = 'chip-sorting';
    let chips = filters.querySelectorAll("md-filter-chip");
    for (let chip of chips) {
        // This setTimeout is a workaround for the filter chips
        //  sometimes updating their state slightly slower than
        //  they fire the onclick event
        chip.onclick = () => setTimeout(renderNotesList, 100);
    }
}

function openSortMenu() {
    sortMenu.open = !sortMenu.open;
}

/**
 * 
 * @param {Note[]} notesList the list of note
 * @returns an array containing filtered notes of the selected tags
 */
export function sortAndFilter(notesList) {
    let filterChips = filters.querySelectorAll('md-filter-chip');
    let activeFilters = Array.from(filterChips)
        .filter(n => n.selected)
        .map(n => Number.parseInt(n.attributes.getNamedItem('data-filter-id').value));

    return notesList
        .filter(n => activeFilters.every(tID => n.tags.some(t => t.tagID == tID)))
        .sort(currentSortType.sorter);
}

renderTagChips();
renderSortList();