import * as Handlebars from 'handlebars';
import * as ts from '../common/js/tagState';
import { openDeleteDialog } from './deleteTagDialog';

const tagList = document.getElementById('tag-list');

const tagItemsTemplate = Handlebars.compile(
    `
    {{#this}}
    <md-list-item data-tag-id="{{tagID}}">
        {{tagName}}
        <md-icon-button slot="end" class="delete-tag-btn">
            <md-icon>delete</md-icon>
        </md-icon-button>
    </md-list-item>
    {{/this}}
    `
);

export function renderTagList() {
    ts.getTags().then(tags => {
        tagList.innerHTML = tagItemsTemplate(tags);
        registerDeleteButtons();
    });
}

function registerDeleteButtons() {
    for (let listItem of tagList.children) {
        let tagBtn = listItem.querySelector(".delete-tag-btn");
        let tagID = 
            Number.parseInt(listItem.attributes.getNamedItem('data-tag-id').textContent);
        tagBtn.onclick = () => openDeleteDialog(tagID);
    }
}

renderTagList();