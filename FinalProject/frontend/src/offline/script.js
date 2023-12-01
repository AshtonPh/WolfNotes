import '@material/web/icon/icon';
import '@material/web/list/list';
import '@material/web/list/list-item';
import * as Handlebars from 'handlebars';
import * as os from '../common/js/offlineState';
import * as util from '../common/js/util';

const noteList = document.getElementById('note-list');
const offlineNotes = document.getElementById('offline-notes');
const offlineMessageNoteless = document.getElementById('offline-message-noteless-wrapper');

Handlebars.registerHelper("niceTime", dO => util.niceTime(dO));

const template = Handlebars.compile(
    `
    {{#this}}
    <md-list-item type="button" data-noteid="{{noteID}}">
        <div class="note-list-name" slot="headline">{{title}}</div>
        <div class="note-list-details" slot="supporting-text">
            <div class="note-list-details-item"><md-icon>history</md-icon> Edited {{niceTime dateEdited}}</div>
            {{#tags}}
            <div class="note-list-details-item"><md-icon>sell</md-icon> {{this.tagName}}</div>
            {{/tags}}
        </div>
    </md-list-item>
    {{/this}}
    `
);

function registerClickEvents() {
    for (let i of noteList.children) {
        let nID = i.attributes.getNamedItem('data-noteid').textContent;
        i.onclick = () => document.location.href = `/offline-viewer/?noteID=${nID}`;
    }
}

async function init() {
    if (await os.anyOfflineNotes()) {
        offlineNotes.style.display = 'block';
        let notes = await os.getNotes();
        noteList.innerHTML = template(notes);
    }
    else {
        offlineMessageNoteless.style.display = 'flex';
    }
    registerClickEvents();
}

init();