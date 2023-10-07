const express = require("express");
const app = express();
const router = express.Router();
const example = require("./example/notesRouter-example");

//Middleware to parse JSON request bodies
app.use(express.json());


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

// Create a new note
app.post('/notes/', (req, res) => {

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
app.get('/notes/:noteID', (req, res) => {

    if (!authenticate(req))
        return;
    const { noteID } = req.params;
  
    // Find the note with the specified ID
    const note = notes.find((note) => note.noteID === noteID);
  
    // Check if the note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
  
    // Return the note
    res.status(200).json(note);
  });

// Update a note by its id
app.put("/notes/:noteID", (req, res) => {

    if (!authenticate(req))
        return;
    const { noteID } = req.params;
    const { title, content, tags } = req.body;
  
    // Find the note with the specified ID
    const noteIndex = example.notes.findIndex((note) => note.noteID === noteID);
  
    // Check if the note exists
    if (noteIndex === -1) {
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
app.delete("/notes/:noteID", (req, res) => {
    if (!authenticate(req))
        return;
    const { noteID } = req.params;
  
    // Find the note with the specified ID
    const noteIndex = example.notes.findIndex((note) => note.noteID === noteID);
  
    // Check if the note exists
    if (noteIndex === -1) {
      return res.status(404).json({ error: "Note not found" });
    }
  
    // Remove the note from the array
    const deletedNote = examples.notes.splice(noteIndex, 1)[0];
  
    // Return the deleted note
    res.status(200).json({
      noteID: deletedNote.noteID,
      message: "Note deleted successfully",
    });
  });

// Search notes by a phrase or keyword
app.get("/notes/search", (req, res) => {
    if (!authenticate(req))
        return;
    const { q } = req.query;
  
    // Filter the notes based on the keyword or phrase
    const filteredNotes = notes.filter(
      (note) =>
        note.title.includes(q) ||
        note.content.includes(q) ||
        note.tags.includes(q)
    );
  
    // Return the filtered notes
    res.status(200).json(filteredNotes);
  });

// Search notes by tags
app.get("/notes/searchByTag", (req, res) => {
    if (!authenticate(req))
        return;
    const { tag } = req.query;
  
    // Split the tag parameter into an array of tags
    const tags = tag.split(",");
  
    // Filter the notes based on the tags
    const filteredNotes = notes.filter((note) =>
      tags.every((tag) => note.tags.includes(tag))
    );
  
    // Return the filtered notes
    res.status(200).json(filteredNotes);
  });
  
module.exports = router;