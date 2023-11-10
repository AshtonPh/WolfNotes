module.exports = class {
    chunkId = null;
    noteId = null;
    slideNumber = null;
    contents = null;
  
    constructor(data) {
      this.chunkId = data.chunkID;
      this.noteId = data.noteID;
      this.slideNumber = data.slideNumber;
      this.contents = data.contents;
    }
  
  };