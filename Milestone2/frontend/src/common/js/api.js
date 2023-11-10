/**
 * api.js
 * 
 * Provides some base API methods with error handling and authentication management
 */

const API_BASE = "/api"

/**
 * Make an API request and do error/auth handling.
 * 
 * @param {string} url the URL to request
 * @param {RequestInit} options request options
 * @returns {Promise<Response>} a request promise
 */
function req(url, options) {
    return fetch(API_BASE + url, options)
        .then(res => {
            if (res.status == 401)
                document.location.href = '/login';

            else if (!res.ok)
                errorHandler(url, res.status);

            return res;
        })
        .catch(reason => {
            errorHandler(url, reason);
        });
}

function errorHandler(url, reason) {
    alert(`Something went wrong when trying to fetch ${url} (${reason})`);
}