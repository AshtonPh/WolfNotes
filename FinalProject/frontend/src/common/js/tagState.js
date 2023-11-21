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

let tagSetInitializedPromise;

// Credit to https://www.jonmellman.com/posts/singleton-promises
//  for this 'singleton promise' pattern
function initializeTagSet() {
    if (!tagSetInitializedPromise) {
        tagSetInitializedPromise = new Promise((resolve, reject) => {
            api.req('/tags')
                .then(res => res.json())
                .then(res => {
                    tagSet = res.map(note => Tag.fromApi(note));
                    resolve();
                }).catch(reason => reject(reason));
        })
    }
    return tagSetInitializedPromise;
}

/**
 * @returns {Promise<Tag[]>}
 */
export function getTags() {
    return initializeTagSet().then(() => tagSet);
}

export function getTagByID(tagID) {
    return initializeTagSet.then(() => tagSet.find(t => t.tagID == tagID));
}

/**
 * @param {string} name 
 * @returns {Promise}
 */
export function createTag(name) {
    return initializeTagSet().then(() =>
        api.req('/tags', {
            body: JSON.stringify({ tagName: name }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(res => {
            let newTag = new Tag;
            newTag.tagName = name;
            newTag.tagID = res.tagID;
            tagSet.push(newTag);
            return newTag;
        })
    );
}

/**
 * @param {Tag} tag 
 * @returns {Promise}
 */
export function deleteTag(tag) {
    return initializeTagSet().then(() =>
        api.req(`/tags/${tag.tagID}`, { method: 'DELETE' }).then(res => {
            tagSet = tagSet.filter(t => t.tagID != tag.tagID);
            processTagDeletion(tag.tagID);
        }));
}