import '@material/web/button/filled-button'
// Get the reference to the img-container element
const imgContainer = document.getElementById("img-container");

// Function to fetch the images from the folder
async function fetchImages() {
  try {
    // Make a request to the server to get the list of images in the folder
    const response = await fetch("images");
    const images = await response.json();

    // Loop through the images and create img elements
    images.forEach((image) => {
      const imgElement = document.createElement("img");
      imgElement.src = image;
      imgElement.style.width = "100%";

      // Append the img element to the img-container
      imgContainer.appendChild(imgElement);
    });
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

// Run the fetchImages function when the website finishes loading
document.addEventListener("DOMContentLoaded", fetchImages);
