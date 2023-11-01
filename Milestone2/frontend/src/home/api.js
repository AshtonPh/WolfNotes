/**
 * api.js
 * 
 * Handles interacting with the wolfnotes api
 */

const API_BASE = "/api"

function getAuthToken() {
    return 'afj93sfjkljawef';
}

function requestApi(url, options) {
    if (!options) options = {}
    if (!options.headers) options.headers = new Headers()
    options.headers.append("Authorization", "token " + getAuthToken());
    return fetch(API_BASE + url, options)
        .then(res => {
            if (!res.ok)
                errorHandler(url, res.status);
            
            return res;
        })
        .catch(reason => {
            errorHandler(url, reason);
        }
        );
}

function errorHandler(url, reason) {
    alert(`Something went wrong when trying to fetch ${url} (${reason})`)
}

export function getNotesList() {
    return requestApi("/notes/all").then(res => res.json());
}

export function getSuggestions() {
    return requestApi("/notes/suggested")
        .then(res => res.json());
}

// Used this article to help:
//   https://stackoverflow.com/questions/23609946/img-src-path-with-header-params-to-pass
export async function getSlideImage(noteID, slideNumber) {
    let res = await requestApi(`/data/${noteID}/slide/${slideNumber}`);
    let blob = await res.blob();
    return URL.createObjectURL(blob);
}

export function getUserEmail() {
    return new Promise((res, rej) => res("sdent@ncsu.edu"));
}

export async function getUserPicture() {
    // Temporary until our profile picture endpoint is working
    return "https://cdn.discordapp.com/avatars/824267104936919101/1eeeecd35d81c4c0eedc266fd41b0d1c.webp?size=160";
    let res = await requestApi(`/auth/user-profile/picture`);
    let blob = await res.blob();
    return URL.createObjectURL(blob);
}

export function deleteNote(noteID) {
    return requestApi(`/notes/${noteID}`, {
        method: 'DELETE'
    });
}

export function createNote(title, tags) {
    return requestApi(`/notes`, {
        method: 'POST',
        body: JSON.stringify({title, tags})
    });
}
