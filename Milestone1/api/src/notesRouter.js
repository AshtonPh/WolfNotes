const express = require("express");
const router = express.Router();
const example = require("./example/notesRouter-example");



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

// Get all notes
router.get("/allNotes", (req, res) => {
  if (!authenticate(req))
    return;

  // Return all notes
  res.status(200).json(example.notes);
});



// Search notes by tags
// Checked
router.get("/searchByTag", (req, res) => {
  if (!authenticate(req))
      return;
  const { tag } = req.query;

  // Split the tag parameter into an array of tags
  const tags = tag.split(",");

  // Filter the notes based on the tags
  const filteredNotes = example.notes.filter((note) =>
    tags.every((tag) => note.tags.includes(tag))
  );

  if (filteredNotes.length == 0){
    res.status(404).json({ error: "Note not found" });
  } 
  // Return the filtered notes
  res.status(200).json(filteredNotes);
});

// Search notes by a phrase or keyword
router.get("/search", (req, res) => {
  if (!authenticate(req))
    return;
  const { q } = req.query;
  
  const tag_include = (element) => element.includes(q) === true;
  // Filter the notes based on the keyword or phrase
  const filteredNotes = example.notes.filter(
    (note) =>
      note.title.includes(q) ||
      note.content.includes(q) ||
      note.tags.some(tag_include)
  );

  if (filteredNotes.length == 0){
    res.status(404).json({ error: "Note not found" });
  } 

  // Return the filtered notes
  res.status(200).json(filteredNotes);
});



// Create a new note
// Checked
router.post('/', (req, res) => {

    if (!authenticate(req))
        return;
    const { noteID, title, content, tags } = req.body;
  

    // Validate the required parameters
    if (!noteID || !title || !content || !tags) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

     // Create a new note object
    const newNote = {
        noteID,
        title,
        content,
        tags
    };

    // Add the new note to the notes array
    example.notes.push(newNote);

    // Assuming the validation is successful, send the response
    res.status(200).json({
      noteID,
      message: 'Note created successfully'
    });

  });

// Get a note by its id
// Checked
router.get('/:noteID', (req, res) => {
  if (!authenticate(req))
    return;
  let noteID = req.params.noteID;
  
    // Find the note with the specified ID
  const note = example.notes.find((note) => note.noteID == noteID);
  
    // Check if the note exists
  if (!note) {
      return res.status(404).json({ error: "Note not found" });
  }
  
    // Return the note
    res.status(200).json(note);
});

// Update a note by its id
// Checked
router.put("/:noteID", (req, res) => {

  if (!authenticate(req))
      return;

  const { noteID, title, content, tags } = req.body;

  // Validate the required parameters
  if (!noteID || !title || !content || !tags) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
    
  
  // Find the note with the specified ID
  const noteIndex = example.notes.findIndex((note) => note.noteID == noteID);
  
  // Check if the note exists
  if (noteIndex == -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  
  // Update the note
  example.notes[noteIndex] = {
    noteID,
    title,
    content,
    tags,
  };

  // Return the updated note
  res.status(200).json({
    noteID,
    message: "Note updated successfully",
  });
});

// Delete a note by its id
// Checked
router.delete("/:noteID", (req, res) => {
  if (!authenticate(req))
    return;
  let noteID  = req.params.noteID;
  
  // Find the note with the specified ID
  const noteIndex = example.notes.findIndex((note) => note.noteID == noteID);
  
  // Check if the note exists
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  
  // Remove the note from the array
  const deletedNote = example.notes.splice(noteIndex, 1)[0];
  
  // Return the deleted note
  res.status(200).json({
    noteID: deletedNote.noteID,
    message: "Note deleted successfully",
  });
});





module.exports = router;