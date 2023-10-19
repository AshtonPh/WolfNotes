import '@material/web/button/filled-button';

var currentIndex = 1;
var imageContainer = document.getElementById("img-container");
var imageElement = document.getElementById("img");
var prevButton = document.getElementById("prev-btn");
var nextButton = document.getElementById("next-btn");
const slide_length = 14;
var images = [];

for (let i = 0; i <= slide_length; i++) {
    var img = document.createElement('img');
    img.id = "img";
    img.src = "../notes/images/" + i.toString() + ".jpg";
    img.style = "width: 100%";
    img.alt = i.toString();
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

prevButton.addEventListener("click", prevImage);
nextButton.addEventListener("click", nextImage);

updateImage();
