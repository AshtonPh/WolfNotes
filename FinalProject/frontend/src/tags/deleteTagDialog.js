import * as ts from '../common/js/tagState'
import { renderTagList } from './tagList';

const deleteTagDialog = document.getElementById('delete-tag-dialog');
const deleteContent = document.getElementById('delete-content');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

let activeTag;

export function openDeleteDialog(tagID) {
    ts.getTags().then(tags => {
        activeTag = tags.find(t => t.tagID == tagID);
        if (activeTag != undefined) {
            deleteContent.innerText = `Are you sure you want to delete "${activeTag.tagName}"?`;
            deleteTagDialog.open = true;
        }
    });
}

function confirmDelete() {
    ts.deleteTag(activeTag).then(() => {
        renderTagList();
        deleteTagDialog.open = false;
    })
}

confirmDeleteBtn.onclick = confirmDelete;
cancelDeleteBtn.onclick = () => deleteTagDialog.open = false;