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

var images = [];

ns.getNote(noteId).then(note => {
   slide_length = note.slideCount -1;
   console.log(slide_length);

   
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
	fetch(`/api/data/${noteId}/chunks`, {
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
    var element = document.getElementById(elementId);
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
              editor.contentEditable = true;
              editor.id = 'editor' + slideNumber;
              newDiv.appendChild(editor);
              outerDiv.appendChild(newDiv);
          }

          // Set the innerHTML of the editor to the contents
          editor.innerHTML = contents;
      });
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}


setInterval(() => {
    contents = getContent("editor" + activeNote);
	saveNote(noteId, activeNote, contents);
}, 600000);

prevButton.addEventListener("click", prevImage);

nextButton.addEventListener("click", nextImage);

prevButton.addEventListener("click", () => {
    contents = getContent("editor" + activeNote);
	saveNote(noteId, activeNote, contents);
});

nextButton.addEventListener("click", () => {
    contents = getContent("editor" + activeNote);
    saveNote(noteId, activeNote, contents);
});

let editor = document.querySelector('.edit-content');

editor.addEventListener('input', function() {
   let contents = getContent("editor" + activeNote);

   saveNote(noteId, currentIndex, contents);
});



