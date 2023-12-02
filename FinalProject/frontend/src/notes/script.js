import '@material/web/button/filled-button';

import * as ns from '../common/js/noteState';
import * as api from '../common/js/api';

var currentIndex = 0;
var imageContainer = document.getElementById("img-container");
var imageElement = document.getElementById("img");
var prevButton = document.getElementById("prev-btn");
var nextButton = document.getElementById("next-btn");

let params = new URLSearchParams(document.location.search);

var noteId = params.get("noteid"); 
var size = "slide";

let slide_length
let note_title

var images = [];

ns.getNote(noteId).then(note => {
    slide_length = note.slideCount -1;
    note_title = note.title;
    document.getElementById("title").innerHTML = note_title;

   
    for (let i = 0; i <= slide_length; i++) {
        var img = document.createElement('img');
        img.id = "img";
        img.style = "width: 100%";
        img.alt = i.toString();
        let imgURL = `/api/data/${noteId}/${i}/${size}`;
        img.src = imgURL;
        images.push(img);
    }

    updateImage();

    setContentBySlideNumber(noteId);

    setInterval(() => {
        let contents = getContent("editor" + currentIndex);
        saveNote(noteId, currentIndex, contents);
    }, 500);

 })
 .catch(error => {
   // Handle any errors that occurred during the Promise
   console.error(error);
 });




 

// Function to update the image source
function updateImage() {
    imageElement.remove();
    imageContainer.appendChild(images[currentIndex]);
    imageElement = document.getElementById("img");
}

// Function to handle the previous button click
function prevImage() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = images.length - 1;
    }
    updateImage();
}

// Function to handle the next button click
function nextImage() {
    if (currentIndex < images.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateImage();
}


function saveNote(noteId, slideNumber, contents) {
	api.req(`/data/${noteId}/chunks`, {
	 method: 'POST',
	 headers: {
	   'Content-Type': 'application/json',
	 },
	 body: JSON.stringify({ slideNumber, contents }),
	})
	.then(response => response.json())
	.then(data => console.log(data))
	.catch((error) => {
	 console.error('Error:', error);
	});
}

function getContent(elementId) {
    let element = document.getElementById(elementId);
    return element.innerHTML;
}

function setContentBySlideNumber(noteId) {
    api.req(`/data/${noteId}/chunks`, {
        method: 'GET'
     })
  .then(response => response.json())
  .then(data => {
      // Loop through each chunk
      data.forEach(chunk => {
          // Get the slide number and contents from the chunk
          const slideNumber = chunk.slideNumber;
          const contents = chunk.contents;

          // Check if the element with id "editor" + slideNumber exists
          let editor = document.getElementById("editor" + slideNumber);
          // If it doesn't exist, create it
          if (!editor) {
              let outerDiv = document.querySelector('.edit-content');
              let newDiv = document.createElement('div');
              newDiv.className = 'slide-note fade';
              editor = document.createElement('div');
              editor.className = 'editor';
              editor.id = 'editor' + slideNumber;
              editor.setAttribute('hidden', '');
              newDiv.appendChild(editor);
              outerDiv.appendChild(editor);
          }

          // Set the innerHTML of the editor to the contents
          editor.innerHTML = contents;
      });

      
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}




prevButton.addEventListener("click", prevImage);

nextButton.addEventListener("click", nextImage);

prevButton.addEventListener("click", () => {
    let contents = getContent("editor" + currentIndex);
	saveNote(noteId, currentIndex, contents);
});

nextButton.addEventListener("click", () => {
    let contents = getContent("editor" + currentIndex);
    saveNote(noteId, currentIndex, contents);
});

