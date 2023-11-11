const express = require("express");
const cookieParser = require('cookie-parser');
const tk = require('../middleware/TokenMiddleware');


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
      // Set the Content-Type header to the type of the image
      res.setHeader('Content-Type', 'image/jpg'); 
  
      // Send the image data as a response
      res.send(imageData);
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
 });
 

const { promises: fs } = require("fs");
const { pdf } = require("pdf-to-img");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.post('/:noteId/', upload.single('pdf'), async (req, res) => {
  const noteId = req.params.noteId;
  const pdfBuffer = await fs.readFile(req.file.path);

  try {
    // Convert the PDF into images
    const document = await pdf(pdfBuffer, { scale: 3 });
    let counter = 1;
    for await (const image of document) {
      //const imagePath = `${counter}.png`;
      //await fs.writeFile(imagePath, image);
      
      // Upload the image
      const imageData = await dataDao.uploadImage(noteId, counter, image, '1');
      counter++;
    }
    res.status(200).json({message: 'success'});
  } catch (err) {
    res.status(500).json({error: err});
  }
 });
 


module.exports = router;