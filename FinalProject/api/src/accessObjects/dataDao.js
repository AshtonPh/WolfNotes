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

async function updateChunk(noteId, slideNumber, contents) {
  const { results } = await db.query(
    "INSERT INTO NoteData (noteID, slideNumber, contents) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE contents = ?",
    [noteId, slideNumber, contents, contents]);
  await db.query("UPDATE Note SET dateEdited = ? WHERE noteID = ?", [new Date(), noteId]);
  getSlideAndContentsByNoteID(results.insertId);
}


function getImageByNoteID(noteId, slideNumber, size) {
  if (size === 'slide')
    return db.query('SELECT * FROM SlideImage WHERE noteID=? AND slideNumber=?', [noteId, slideNumber])
    .then(({results}) => {
      return results[0].slide;
    })
  else if (size === 'thumbnail')
    return db.query('SELECT * FROM SlideImage WHERE noteID=? AND slideNumber=?', [noteId, slideNumber])
    .then(({results}) => {
      return results[0].thumbnail;
 });
}

function uploadImage(noteId, slideNumber, image, userID) {
  return db.query(
    "INSERT INTO SlideImage (noteID, slideNumber, userID, slide, thumbnail) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE slide = ?, thumbnail = ?",
   [noteId, slideNumber, userID, image, image , image, image]).then(({results}) => {
     getSlideAndContentsByNoteID(results.insertId)
  });
}
 
   
module.exports = {
    //getContentsByNoteID: getContentsByNoteID,
    getSlideAndContentsByNoteID: getSlideAndContentsByNoteID,
    updateChunk: updateChunk,
    getImageByNoteID:getImageByNoteID,
    uploadImage:uploadImage
  };
  