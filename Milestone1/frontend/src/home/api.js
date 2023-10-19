/**
 * api.js
 * 
 * Handles interacting with the wolfnotes api
 */

const API_BASE = "http://localhost:3501"

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
    // TODO - replace this with the proper design
    // return fetch(API_BASE + "/notes/list")
    return new Promise((resolve, reject) => {
        resolve([
            {
                "noteID": "1",
                "title": "Lecture #1",
                "content": "Note created sucessfully  ",
                "tags": ["Course A", "Professor A"]
            },

            {
                "noteID": "1",
                "title": "Lecture #10",
                "content": "Note created sucessfully  ",
                "tags": ["Course B", "Professor B"]
            },

            {
                "noteID": "1",
                "title": "Lecture #11",
                "content": "Note created sucessfully  ",
                "tags": ["Course B", "Professor A"]
            }
        ])
    });
}

export function getSuggestions() {
    // TODO - replace this with the proper design
    // return fetch(API_BASE + "/notes/list")
    return new Promise((resolve, reject) => {
        resolve([
            {
                "noteID": "1",
                "title": "Lecture #1",
                "content": "Note created sucessfully  ",
                "tags": ["Course A", "Professor A"],
                "reason": "Often opened around this time"
            },

            {
                "noteID": "1",
                "title": "Lecture #10",
                "content": "Note created sucessfully  ",
                "tags": ["Course B", "Professor B"],
                "reason": "You modified this recently"
            }
        ])
    });
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