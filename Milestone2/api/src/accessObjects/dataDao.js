const db = require('./connectionProvider');
const data = require('./models/Data');

/*
function getContentsByNoteID(noteId) {
    return query('SELECT * FROM yourTableName WHERE noteID=?', [noteId]).then(({results}) => {
      return results.map(row => row);
    });
}*/

function getSlideAndContentsByNoteID(noteId) {
    return db.query('SELECT slideNumber, contents FROM NoteData WHERE noteID=?', [noteId])
    .then(({results}) => {
     return results.map(row => new data(row));
    });
}

function updateChunk(noteId, slideNumber, contents) {
  return db.query(
    "INSERT INTO NoteData (noteID, slideNumber, contents) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE contents = ?",
   [noteId, slideNumber, contents, contents]).then(({results}) => {
     getSlideAndContentsByNoteID(results.insertId)
  });
}


function getImageByNoteID(noteId, slideNumber, size) {
  return db.query('SELECT * FROM SlideImage WHERE noteID=? AND slideNumber=?', [noteId, slideNumber])
  .then(({results}) => {
    return results[0].slide;
  });
 }
 

 

   
module.exports = {
    //getContentsByNoteID: getContentsByNoteID,
    getSlideAndContentsByNoteID: getSlideAndContentsByNoteID,
    updateChunk: updateChunk,
    getImageByNoteID:getImageByNoteID
  };
  