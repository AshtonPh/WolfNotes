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
   


module.exports = router;