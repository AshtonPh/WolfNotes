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
router.get("/all", (req, res) => {
  if (!authenticate(req))
    return;

  // Check if each note has been edited within the last week
  example.notes.forEach((note) => {
    if (!isWithinLastWeek(note.timeEdited)) {
      note.recentlyEdited = false;
    }
  });

  // Return all notes
  res.status(200).json(example.notes);
});

// Get suggested notes
router.get("/suggested", (req, res) => {
  if (!authenticate(req))
    return;

  // Check if each note has been edited within the last week
  example.notes.forEach((note) => {
    if (!isWithinLastWeek(note.timeEdited)) {
      note.recentlyEdited = false;
    }
  });

  // Filter notes to get only the recently edited ones
  var recentlyEditedNotes = example.notes.filter(function(note) {
    return note.recentlyEdited;
  });

  if (recentlyEditedNotes.length == 0){
    res.status(404).json({ error: "No notes found" });
  } 

  // Return the recently edited notes
  res.status(200).json(recentlyEditedNotes);
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

    // Find the note with the specified ID
    const note = example.notes.find((note) => note.noteID == noteID);
  
    // Check if the note exists
    if (note) {
      return res.status(403).json({ error: "Note already existed" });
    }

    const recentlyEdited = true;
    const timeEdited = getCurrentDateTime();
     // Create a new note object
    const newNote = {
        noteID,
        title,
        content,
        tags,
        recentlyEdited,
        timeEdited
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

  if (!isWithinLastWeek(note.timeEdited)){
      note.recentlyEdited = false;
  }
  
  // Return the note
  res.status(200).json(note);
});

// Update a note by its id
// Checked
router.put("/:noteID", (req, res) => {

  if (!authenticate(req))
      return;

  let ID = req.params.noteID;
  
  // Find the note with the specified ID
  const note = example.notes.find((note) => note.noteID == ID);
    
  // Check if the note exists
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

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
  
  const recentlyEdited = true;
  const timeEdited = getCurrentDateTime();

  // Update the note
  example.notes[noteIndex] = {
    noteID,
    title,
    content,
    tags,
    recentlyEdited,
    timeEdited
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

function getCurrentDateTime() {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();

  var formattedDate = day + "/" + month + "/" + year;
  var formattedTime = hours + ":" + minutes + ":" + seconds;

  var currentDateTime = formattedDate + " " + formattedTime;

  return currentDateTime;
}

function parseDateTime(dateTimeString) {
  var dateTimeParts = dateTimeString.split(" ");
  var dateParts = dateTimeParts[0].split("/");
  var timeParts = dateTimeParts[1].split(":");

  var day = parseInt(dateParts[0]);
  var month = parseInt(dateParts[1]);
  var year = parseInt(dateParts[2]);
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);
  var seconds = parseInt(timeParts[2]);

  var parsedDateTime = {
    date: {
      day: day,
      month: month,
      year: year
    },
    time: {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
  };

  return parsedDateTime;
}

function isWithinLastWeek(dateTimeString) {
  var parsedDateTime = parseDateTime(dateTimeString);
  var currentDate = new Date();

  var lastWeekDateTime = new Date();
  lastWeekDateTime.setDate(lastWeekDateTime.getDate() - 7);

  var isWithinLastWeek = false;

  var parsedDateTimeObject = new Date(
    parsedDateTime.date.year,
    parsedDateTime.date.month - 1,
    parsedDateTime.date.day,
    parsedDateTime.time.hours,
    parsedDateTime.time.minutes,
    parsedDateTime.time.seconds
  );

  if (parsedDateTimeObject >= lastWeekDateTime && parsedDateTimeObject <= currentDate) {
    isWithinLastWeek = true;
  }

  return isWithinLastWeek;
}

module.exports = router;