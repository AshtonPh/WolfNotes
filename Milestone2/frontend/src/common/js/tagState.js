/**
 * tagState.js
 * 
 * Handles grabbing tag data from the API and keeping local tag state
 */

import * as api from './api';
import { Tag } from './models';
import { processTagDeletion } from './noteState';

/**
 * The current set of tags
 * @type {Tag[]}
 */
let tagSet;

/**
 * @returns {Promise<Tag[]>}
 */
export function getTags() {
    return new Promise((resolve, reject) => {
        if (tagSet) {
            resolve(tagSet);
        }
        else {
            api.req('/tags').then(res => {
                tagSet = res.json().map(note => Tag.fromApi(note));
                resolve(tagSet);
            }).catch(reason => reject(reason));
        }
    });
}

/**
 * @param {string} name 
 * @returns {Promise}
 */
export function createTag(name) {
    return api.req('/tags', {
        body: JSON.stringify({tagName: name}),
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        let newTag = new Tag;
        newTag.tagName = name;
        newTag.tagID = res.json().tagID;
        tagSet.push(newTag);
        return newTag;
    })
}

/**
 * @param {Tag} tag 
 * @returns {Promise}
 */
export function deleteTag(tag) {
    return api.req(`/tags/${tag.tagID}`, {method: 'DELETE'}).then(res => {
        tagSet.filter(t => t != tag);
        processTagDeletion(tag.tagID);
    })
}