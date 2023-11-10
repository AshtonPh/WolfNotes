const Tag = require('./models/tag');
const conPro = require('./connectionProvider')

/**
 * Get a set of all tags for a specific user
 * 
 * @param {number} userID the ID of the user to find tags for
 * @returns {Tag[]} a list of tag objects
 */
function getTagsByUser(userID) {
    return conPro.query('SELECT tagID, tagName FROM Tag WHERE userID = ?', [userID])
        .then(r => r.results.map(t => new Tag(t)));
}

/**
 * Create a new tag for a specific user
 * 
 * @param {number} userID the ID of the user to create the tag for
 * @param {string} tagName the name of the tag to create
 * @returns a Tag object for the newly created tag
 */
function createTag(userID, tagName) {
    return conPro.query('INSERT INTO Tag (userID, tagName) VALUES (?, ?)', [userID, tagName]).then(r => r.results.insertId);
}

/**
 * Delete a tag and remove all assignments to notes
 * 
 * @param {number} tagID the ID of the tag to delete
 * @returns a promise for the deletion query
 */
function deleteTag(tagID) {
    return conPro.query('DELETE FROM Tag WHERE tagID = ?', [tagID])
        .then(() => conPro.query('DELETE FROM NoteTag WHERE tagID = ?', [tagID]));
}

module.exports = {getTagsByUser, createTag, deleteTag}