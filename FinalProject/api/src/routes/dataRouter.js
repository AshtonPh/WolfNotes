const express = require("express");
const cookieParser = require('cookie-parser');
const tk = require('../middleware/TokenMiddleware');
const { promises: fs } = require("fs");
const { pdf } = require("pdf-to-img");
const multer = require('multer')
const upload = multer({
  dest: '/tmp/uploads',
  limits: {
    fieldSize: 1000 * 1024 * 1024,
  },
});

const router = express.Router();
router.use(cookieParser());
router.use(express.json());

const dataDao = require('../accessObjects/dataDao');
const noteDao = require('../accessObjects/noteDao');

// Get all chunks of a note
router.get('/:noteId/chunks', tk.TokenMiddleware, async (req, res) => {
  const noteId = req.params.noteId;
  let note = await noteDao.getNoteByID(noteId);

  if (!note) {
    res.status(404);
    res.send({ 'error': 'not found' });
    return;
  }

  if (note.userID != req.userID) {
    console.log(note.userID);
    console.log(req.userID);
    res.status(403);
    res.send({ 'error': 'forbidden' });
    return;
  }

  dataDao.getSlideAndContentsByNoteID(noteId).then(rows => {
    if (rows.length > 0) {
      res.json(rows);
    }
    else {
      res.json([]);
    }
  })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

//Update a chunk of a note
router.post('/:noteId/chunks', tk.TokenMiddleware, async (req, res) => {
  const noteId = req.params.noteId;
  const slideNumber = req.body.slideNumber;
  const contents = req.body.contents;
  let note = await noteDao.getNoteByID(noteId);

  if (!note) {
    res.status(404);
    res.send({ 'error': 'not found' });
    return;
  }

  if (note.userID != req.userID) {
    console.log(note.userID);
    console.log(req.userID);
    res.status(403);
    res.send({ 'error': 'forbidden' });
    return;
  }

  dataDao.updateChunk(noteId, slideNumber, contents).then(chunk => {
    res.status(200).json(chunk);
  })
});


router.get('/:noteId/:slideNumber/:size', tk.TokenMiddleware, async (req, res) => {
  const noteId = req.params.noteId;
  const slideNumber = req.params.slideNumber;
  const size = req.params.size;

  let note = await noteDao.getNoteByID(noteId);

  if (!note) {
    res.status(404);
    res.send({ 'error': 'not found' });
    return;
  }

  if (note.userID != req.userID) {
    console.log(note.userID);
    console.log(req.userID);
    res.status(403);
    res.send({ 'error': 'forbidden' });
    return;
  }

  dataDao.getImageByNoteID(noteId, slideNumber, size)
    .then(imageData => {
      // Set the Content-Type header to the type of the image
      res.setHeader('Content-Type', 'image/jpg');

      // Send the image data as a response
      res.send(imageData);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});



router.post('/:noteId/', upload.single('pdf'), tk.TokenMiddleware, async (req, res) => {
  const noteId = req.params.noteId;
  const pdfBuffer = await fs.readFile(req.file.path);
  let note = await noteDao.getNoteByID(noteId);

  if (!note) {
    res.status(404);
    res.send({ 'error': 'not found' });
    return;
  }

  if (note.userID != req.userID) {
    console.log(note.userID);
    console.log(req.userID);
    res.status(403);
    res.send({ 'error': 'forbidden' });
    return;
  }

  try {
    // Convert the PDF into images
    const document = await pdf(pdfBuffer, { scale: 3 });
    noteDao.setNoteSlideCount(Number.parseInt(noteId), document.length);
    let counter = 0;
    for await (const image of document) {

      // Upload the image
      const imageData = await dataDao.uploadImage(noteId, counter, image, req.userID);
      counter++;
    }
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;