import '@material/web/icon/icon';
import '@material/web/iconbutton/icon-button'
import * as Handlebars from 'handlebars';
import * as os from '../common/js/offlineState';

const noteTitle = document.getElementById('note-title');
const emptyMessage = document.getElementById('empty-message');
const main = document.getElementsByTagName('main')[0];

const multiChunkTemplate = Handlebars.compile(
    `
    {{#this}}
    <div class="slide-break">
        <span>{{slideNumber}}</span>
        <div></div>
    </div>
    <p>
        {{contents}}
    </p>
    {{/this}}
    `
);

const singleChunkTemplate = Handlebars.compile(
    `
    <p>
        {{contents}}
    </p>
    `
);

async function init() {
    let params = new URLSearchParams(document.location.search);
    let noteID = params.get("noteID");
    if (!noteID)
        document.location.href = '/offline/';
    
    let noteAndChunks = await os.getNoteAndChunks(Number.parseInt(noteID));
    if (!noteAndChunks)
        document.location.href = '/offline/';

    noteTitle.innerText = noteAndChunks.note.title;
    let safeChunks = noteAndChunks.chunks
        .filter(c => c.contents.trim() != '')
        .map(c => ({
            slideNumber: c.slideNumber, 
            contents: new Handlebars.SafeString(c.contents)
        }));
    if (safeChunks.length == 0) {
        emptyMessage.style.display = 'block';
    }
    else if (safeChunks.length == 1) {
        main.innerHTML = singleChunkTemplate(safeChunks[0]);
    }
    else {
        main.innerHTML = multiChunkTemplate(safeChunks);
    }
}

init();