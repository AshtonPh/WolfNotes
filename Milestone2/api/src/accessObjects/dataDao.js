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
     return results.map(row => row);
    });
   }
   
module.exports = {
    //getContentsByNoteID: getContentsByNoteID,
    getSlideAndContentsByNoteID: getSlideAndContentsByNoteID
  };
  