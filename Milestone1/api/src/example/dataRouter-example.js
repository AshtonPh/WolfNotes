let examples = {};

examples.authToken = "afj93sfjkljawef";
examples.noteID = "1";

examples.notes = [
    {
        "slide": 1,
        "data": "Slide 1 notes:\n\n**bold text** and *other markdown*"
    },
    {
        "slide": 2,
        "data": "Slide 2 notes:\n\n<<definition:32laesjfv093j>>*"
    }
];

examples.definitions = [
    {
      "definitionID" :  "32laesjfv093j",
      "slide" : 2,
      "phrase" : "Example",
      "definition" : "a value used to demonstrate a concept"
    },
    {
      "definitionID" :  "f4563oiafnm",
      "slide" : 2,
      "phrase" : "Docker",
      "definition" : "a containerization platform for running isolated applications"
    }
];
  
module.exports = examples