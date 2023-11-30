const express = require("express");
const router = express.Router();
const tk = require('../middleware/TokenMiddleware');
const noteDao = require('../accessObjects/noteDao');
const tagDao = require('../accessObjects/tagDao');

router.post('/', tk.TokenMiddleware, async (req, res) => {
    // Data validation
    let valid = req.body.title &&
        req.body.title.trim().length != 0 &&
        req.body.title.length <= 16 &&
        req.body.tags &&
        req.body.tags.every(v => typeof v == typeof 0);

    if (!valid) {
        res.status(400);
        res.send({ 'error': 'invalid request' });
        return;
    }

    let noteID = await noteDao.createNote(req.body.title, req.userID);
    // Handle tag assignments
    if (req.body.tags.length > 0) {
        let tAssignSuccess = await noteDao.assignTags(req.body.tags, noteID);
        if (!tAssignSuccess) {
            res.status(400);
            res.send({ 'error': 'note created, but failed to assign tags (likely a nonexistant tag provided)' });
            return;
        }
    }
    res.send({ "noteID": noteID });
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

router.get('/:noteID', tk.TokenMiddleware, async (req, res) => {
    let note = await noteDao.getNoteByID(Number.parseInt(req.params.noteID))
    if (note == undefined) {
        res.status(404);
        res.send({ 'error': 'no note found' });
        return;
    }
    
    res.send(note);
});

router.put('/:noteID', tk.TokenMiddleware, async (req, res) => {
    if (req.body.title) {
        if (req.body.title.length > 16 || req.body.title.trim().length == 0) {
            res.status(400);
            res.send({ 'error': 'invalid request' });
            return;
        }

        await noteDao.setNoteTitle(req.params.noteID, req.body.title);
    }
    if (req.body.tags) {
        if (!req.body.tags.every(v => typeof v == typeof 0)) {
            res.status(400);
            res.send({ 'error': 'invalid request' });
            return;
        }

        let tAssignSuccess = await noteDao.assignTags(req.body.tags, req.params.noteID);
        if (!tAssignSuccess) {
            res.status(400);
            res.send({ 'error': 'failed to assign tags (likely a nonexistant tag provided)' });
            return;
        }
    }
    res.send({});
});

router.delete('/:noteID', tk.TokenMiddleware, (req, res) => {
    noteDao.deleteNote(req.params.noteID);
    res.send({});
});

module.exports = router;