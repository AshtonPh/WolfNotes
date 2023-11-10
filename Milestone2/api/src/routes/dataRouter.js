const express = require("express");
const cookieParser = require('cookie-parser');


const router = express.Router();
router.use(cookieParser());
router.use(express.json());

const dataDao = require('../accessObjects/dataDao');

// Get all chunks of a note
router.get('/:noteId/chunks', (req, res) => {
    const noteId = req.params.noteId;
    dataDao.getSlideAndContentsByNoteID(noteId).then(rows => {
      if(rows.length > 0) {
        res.json(rows);
      }
      else {
        res.status(404).json({error: 'Note not found'});
      }
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
});

//Update a chunk of a note
router.post('/:noteId/chunks', (req,  res) => {
  const noteId = req.params.noteId;
  const slideNumber = req.body.slideNumber;
  const contents = req.body.contents;
  dataDao.updateChunk(noteId, slideNumber, contents).then(chunk => {
    res.status(200).json(chunk);
  })
});

   
router.get('/:noteId/:slideNumber/:size', (req, res) => {
  const noteId = req.params.noteId;
  const slideNumber = req.params.slideNumber;
  const size = req.params.size;
  
  dataDao.getImageByNoteID(noteId, slideNumber, size)
    .then(imageData => {
      // Convert the image data to a Buffer
      let buffer = Buffer.from(imageData, 'binary');
  
      // Set the Content-Type header to the type of the image
      res.setHeader('Content-Type', 'image/jpg'); 
  
      // Send the image data as a response
      res.send(buffer);
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
 });
 
 

module.exports = router;