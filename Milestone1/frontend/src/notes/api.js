// Get the form element
const form = document.getElementById('editor');

// Add an event listener to the form's submit event
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Get the textarea value
  const textarea = document.getElementById('default');
  const htmlContent = textarea.value;

  // Define the API endpoint URL
  const apiUrl = 'http://localhost:3501/notes/';

  // Create the request body
  const requestBody = {
    noteID: '1',
    title: 'Lecture #1',
    content: htmlContent,
    tags: ['Course A', 'Professor A'],
  };

  // Send a POST request to the API endpoint
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (response.ok) {
      console.log('File saved successfully');
    } else {
      console.error('Failed to save file');
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
});
