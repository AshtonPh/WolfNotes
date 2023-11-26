import Handlebars from "handlebars";
import * as ns from "../common/js/noteState";
import { openNote } from "./noteItems";

const searchBar = document.getElementById('search-bar');
const searchResults = document.getElementById('search-results');
const searchDialog = document.getElementById('search-dialog');
const searchButton = document.getElementById('search-button');
const searchCloseButton = document.getElementById('search-close-button');

const resultsTemplate = Handlebars.compile(
    `
    {{#this}}
    <md-list-item type="button" data-note-id="{{noteID}}">
        <div slot="headline">{{title}}</div>
        <div slot="supporting-text">{{tag}}</div>
    </md-list-item>
    {{/this}}
    `
);

const noResFoundHTML = `
  <md-list-item>
    <div slot="headline">No results</div>
  </md-list-item>
`;

class SearchRes {
    /** @type {number} */
    noteID;
    /** @type {Handlebars.SafeString} */
    title;
    /** @type {Handlebars.SafeString} */
    tag;
    /** @type {number} */
    rank;
}

function open() {
    searchBar.value = '';
    searchResults.innerHTML = '';
    searchDialog.open = true;
}

function close() {
    searchDialog.open = false;
}

function includesNoCase(input, match) {
    return input.toLowerCase().includes(match);
}

/**
 * Put <strong> tags around every term in 'terms' that appears in 
 * the string to search, case insensitive
 * 
 * @param {string[]} terms 
 * @param {string} stringToSearch 
 * @returns {Handlebars.SafeString}
 */
function strongifyAllInArray(terms, stringToSearch) {
    let escaped = Handlebars.escapeExpression(stringToSearch);
    let lower = escaped.toLowerCase();
    
    let toInsert = terms
        .map(t => Handlebars.escapeExpression(t))
        .map(t => ({start: lower.indexOf(t), end: t.length + lower.indexOf(t)}))
        .filter(idx => idx.start != -1)
        .sort((idx1, idx2) => idx1.start - idx2.start);
    let starts = toInsert.map(idx => idx.start);
    let ends = toInsert.map(idx => idx.end);

    let finalStr = '';
    for (let i = 0; i < escaped.length; i++) {
        finalStr += starts.filter(s => s == i).map(() => '<strong>').join();
        finalStr += escaped[i];
        finalStr += ends.filter(s => s == i + 1).map(() => '</strong>').join();
    }

    return new Handlebars.SafeString(finalStr);
}

/**
 * Search the title and tags for all note objects for a specific string.
 * 
 * @param {string} term what the user entered into the search bar
 * @returns {SearchRes[]}
 */
async function getMatches(term) {
    /** @type {string[]} */
    let sections = term.split(' ').filter(s => s != '').map(s => s.toLowerCase())
    let notes = await ns.getNotes();
    let matches = notes
        // Find any tags that include something in the search terms
        .map(n => ({
            n: n,
            t: n.tags.filter(t => sections.some(s => includesNoCase(t.tagName, s)))
        }))
        // Take only the notes that include matching tags
        //  or have a title that matches something in the search terms
        .filter(nT => 
            // Does the title include any section of the search term?
            sections.some(sec => includesNoCase(nT.n.title, sec)) ||
            // Do the tags contain any section of the search term?
            nT.t.length > 0
            )
        // Turn the found notes into SearchResult objects
        .map(nT => {
            let sr = new SearchRes;
            sr.noteID = nT.n.noteID;
            sr.title = strongifyAllInArray(sections, nT.n.title);
            sr.tag = strongifyAllInArray(
                sections, nT.t.map(t => t.tagName).join(', '));

            // Calculate the rank
            // Rank is calculated as
            //  2 * (# of matched characters in the title) +
            //  (# of matched characters in the tags)
            sr.rank = 
                2 * sections.filter(s => nT.n.title.includes(s)).map(s => s.length) +
                sections.filter(s => nT.t.some(t => includesNoCase(t.tagName, s))).map(s => s.length);
            return sr;
        })
        .sort((sr1, sr2) => sr2.rank - sr1.rank);
    return matches;
}

function registerClickEvents() {
    for (let c of searchResults.children) {
        let nID = Number.parseInt(c.attributes.getNamedItem('data-note-id').textContent);
        c.onclick = () => openNote(nID);
    }
}

function doSearch() {
    let term = searchBar.value;
    if (term.trim() == '') {
        searchResults.innerHTML = '';
        return;
    }

    getMatches(term).then(matches => {
        if (matches.length > 0) {
            searchResults.innerHTML = resultsTemplate(matches);
            registerClickEvents();
        }
        else {
            searchResults.innerHTML = noResFoundHTML;
        }
    });
}

let valueTimeout;
function searchBarChanged() {
    if (valueTimeout)
        clearTimeout(valueTimeout);

    valueTimeout = setTimeout(doSearch, 100);
}

searchButton.onclick = open;
searchCloseButton.onclick = close;
searchBar.onkeyup = searchBarChanged;