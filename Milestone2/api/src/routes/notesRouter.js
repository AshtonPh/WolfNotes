const express = require("express");
const router = express.Router();
const tk = require('../middleware/TokenMiddleware');
const noteDao = require('../accessObjects/noteDao');
const tagDao = require('../accessObjects/tagDao');

router.post('/', tk.TokenMiddleware, (req, res) => {
    noteDao.createNote(req.body.title, req.userID).then(noteID => {
        // Handle tag assignments
        // If there's string inside the note array, assume that tags need to be created
        let newTags = req.body.tags.filter(t => typeof t === typeof "");
        if (newTags.length > 0) {
            Promise.all(newTags.map(nT => tagDao.createTag(req.userID, nT))).then(tagIds => {
                allTags = tagIds.concat(req.body.tags.filter(t => typeof t === typeof 0));
                noteDao.assignTags(allTags, noteID);
            });
        }
        else if (req.body.tags.length > 0) {
            noteDao.assignTags(req.body.tags, noteID);
        }

        res.send({"noteID" : noteID});
    });
});

router.get('/all', tk.TokenMiddleware, (req, res) => {
    noteDao.getNotesByUser(req.userID).then(notes => {
        res.send(notes);
    });
});

router.get('/suggested', tk.TokenMiddleware, (req, res) => {
    noteDao.getSuggestedNotes(req.userID).then(notes => {
        res.send(notes);
    })
});

router.get('/:noteID', tk.TokenMiddleware, (req, res) => {
    noteDao.getNoteByID(Number.parseInt(req.params.noteID))
        .then(note => res.send(note));
});

router.put('/:noteID', tk.TokenMiddleware, (req, res) => {
    if (req.body.title) {
        noteDao.setNoteTitle(req.params.noteID, req.body.title);
    }
    if (req.body.tags) {
        // Handle tag assignments
        // If there's string inside the note array, assume that tags need to be created
        let newTags = req.body.tags.filter(t => typeof t === typeof "");
        if (newTags.length > 0) {
            Promise.all(newTags.map(nT => tagDao.createTag(req.userID, nT))).then(tagIds => {
                allTags = tagIds.concat(req.body.tags.filter(t => typeof t === typeof 0));
                noteDao.assignTags(allTags, req.params.noteID);
            });
        }
        else if (req.body.tags.length > 0) {
            noteDao.assignTags(req.body.tags, req.params.noteID);
        }
    }
    res.send({});
});

router.delete('/:noteID', tk.TokenMiddleware, (req, res) => {
    noteDao.deleteNote(req.params.noteID);
    res.send({});
});

module.exports = router;