/**
 * requireOnline.js
 * 
 * Including this file in a <script> tag will redirect the user to '/offline' if they
 * try to load the page without internet
 */

/**
 * Ensure the user is online
 */
export async function requireOnline() {
    let online = await (await fetch('/api/online')).json();
    if (!online.check) {
        document.location.href = '/offline';
    }
}

requireOnline();