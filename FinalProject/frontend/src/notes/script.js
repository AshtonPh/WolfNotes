import '@material/web/button/filled-button';

var currentIndex = 0;
var imageContainer = document.getElementById("img-container");
var imageElement = document.getElementById("img");
var prevButton = document.getElementById("prev-btn");
var nextButton = document.getElementById("next-btn");
var noteId = "6";
var size = "slide";

const slide_length = 21;
var images = [];

for (let i = 0; i <= slide_length; i++) {
    var img = document.createElement('img');
    img.id = "img";
    img.style = "width: 100%";
    img.alt = i.toString();
 
    // Use the fetch API to get the image data from the server
    /*
    fetch(`http://localhost/api/data/${noteId}/${i}/${size}`)
        //.then(response => response.blob())
        .then(blob => {
            // Create a Blob URL for the image
            var url = URL.createObjectURL(blob);
            //img.src = url;
            img.src = blob;
        })
        .catch(err => console.error(err));
    */
    let imgURL = `/api/data/${noteId}/${i}/${size}`;
    img.src = imgURL;
    images.push(img);
 }
 

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
	fetch(`http://localhost/api/data/${noteId}/chunks`, {
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


updateImage();
