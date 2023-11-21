import * as ts from '../common/js/tagState'
import { renderTagList } from './tagList';

const newTagDialog = document.getElementById('new-tag-dialog');
const confirmNewBtn = document.getElementById('confirm-new-btn');
const cancelNewBtn = document.getElementById('cancel-new-btn');
const newTagBtn = document.getElementById('new-tag-btn');
const newTagName = document.getElementById('new-tag-name');

function confirmCreate() {
    let trimmed = newTagName.value.trim()
    if (trimmed == "") {
        newTagName.setCustomValidity("Please enter a tag name");
        newTagName.reportValidity();
        return;
    }

    ts.getTags()
        .then(tags => {
            if (tags.some(t => t.tagName == newTagName.value)) {
                newTagName.setCustomValidity("A tag with this name already exists");
                newTagName.reportValidity();
                return Promise.reject("InvalidName");
            }
        })        
        .then(() => ts.createTag(trimmed))
        .then(() => {
            newTagDialog.open = false;
            renderTagList();
        })
        .catch(() => {});
}

function openNewTagDialog() {
    newTagName.value = "";
    newTagDialog.open = true;
}

confirmNewBtn.onclick = confirmCreate;
newTagBtn.onclick = openNewTagDialog;
cancelNewBtn.onclick = () => newTagDialog.open = false;