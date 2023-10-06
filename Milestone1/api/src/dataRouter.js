// REMOVE ME before the final version
const example = require("./example/dataRouter-example");

const express = require("express");
const multer = require('multer')
const fs = require('node:fs');
const examples = require("./example/dataRouter-example");
const router = express.Router();
const upload = multer({dest: `${__dirname}/example/upload`})

// Placeholder authentication method
// Returns true on successful auth, returns false and sends 403 otherwise
function authenticate(req) {
    if (req.headers.authorization == `token ${example.authToken}`) {
        return true;
    }
    else {
        res.status(403);
        res.send({ "error": "invalid authentication token" });
        return false;
    }
}

// Placeholder ID generator
function genID() {
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let str = "";
    for (let i = 0; i < 10; i++) {
        str += `${chars[Math.round(Math.random() * 20)]}`;
    }
    return str;
}

// Save a "chunk" (slide) for a specific note
router.post('/:noteID/chunk', (req, res) => {
    if (!authenticate(req))
        return;

    if (req.params.noteID != example.noteID) {
        res.status(404);
        res.send({ "error": "invalid note ID" });
    }

    res.send({});
    let targetChunk = examples.notes.find(n => n.slide == req.body.slide);
    if (targetChunk === null) {
        example.notes.push({ "slide": req.body.slide, "data": req.body.data });
    }
    else {
        targetChunk.data = req.body.data;
    }

    console.log(`Note data for slide ${req.body.slide}: ${req.body.data}`);
});

// Retrieve all "chunks" (slides) for a specific note
router.get('/:noteID/chunks', (req, res) => {
    if (!authenticate(req))
        return;

    if (req.params.noteID != example.noteID) {
        res.status(404);
        res.send({ "error": "invalid note ID" });
        return;
    }

    res.send(example.notes);
});

// Save a new definition
router.post('/:noteID/definition', (req, res) => {
    if (!authenticate(req))
        return;

    if (req.params.noteID != example.noteID) {
        res.status(404);
        res.send({ "error": "invalid note ID" });
        return;
    }

    let targetDef = req.body.definitionID === null ? null :
        example.definitions.find(def => def.definitionID == req.body.definitionID);

    if (targetDef === null) {
        let newID = req.body.definitionID === null ? genID() : req.body.definitionID;
        example.definitions.push({
            "definitionID" : newID,
            "definition" : req.body.definition,
            "phrase" : req.body.phrase,
            "slide" : req.body.slide,
        });
        res.send({"definitionID" : newID});
    }
    else {
        targetDef.phrase = req.body.phrase;
        targetDef.definition = req.body.definition;
        targetDef.slide = req.body.slide;
        res.send({ "definitionID": targetDef.definitionID });
    }
});

// Retrieve all existing definitions for a specific note
router.get('/:noteID/definitions', (req, res) => {
    if (!authenticate(req))
        return;

    if (req.params.noteID != example.noteID) {
        res.status(404);
        res.send({ "error": "invalid note ID" });
    }

    res.send(example.definitions);
});

// Since this is being developed independently of the tagging system,
//  the mockup version will return all definitions for any given tag name
router.get('/:tagName/class_definitions', (req, res) => {
    if (!authenticate(req))
        return;

    res.send(example.definitions);
});

// Post a new set of slides for a set of notes
// For the mockup, this doesn't actually do anything except save the PDF to disk
router.post('/:noteID/slides', upload.any(), (req, res) => {
    if (!authenticate(req))
        return;

    if (req.params.noteID != example.noteID) {
        res.status(404);
        res.send({ "error": "invalid note ID" });
        return;
    }

    if (req.file === null) {
        res.status(401);
        res.send({"error":"bad request; no file included"});
        return;
    }

    console.log("Slides recieved!")
    res.send({});
});

// Retrieve a slide for a set of notes
// For the mockup, this just retrieves one of the example slides
router.get('/:noteID/slide/:slideNumber', (req, res) => {
    if (!authenticate(req))
        return;

    if (req.params.noteID != example.noteID) {
        res.status(404);
        res.send({ "error": "invalid note ID" });
        return;
    }

    let path = `${__dirname}/example/exampleSlides/${req.params.slideNumber}.png`;
    if (!fs.existsSync(path)) {
        res.status(404);
        res.send({"error" : "invalid slide number"});
        return;
    }

    res.sendFile(path);
});

module.exports = router;
