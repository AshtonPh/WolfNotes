// document.addEventListener('DOMContentLoaded', function () {
//     const signinForm = document.getElementById('signin-form');
//     signinForm.addEventListener('submit', function (event) {
//       event.preventDefault();
  
//       // Get form input values
//       const username = document.getElementById('username').value;
//       const password = document.getElementById('password').value;

//       // Define the API endpoint URL
//       const apiUrl = 'http://localhost:3501/signin/';
  
//       // Create an object with the sign-in data
//       const signinData = {
//         username,
//         password,
//       };
  
//       // Send a POST request to the sign-in endpoint
//       fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(signinData),
//       })
//         .then((response) => {
//           if (response.ok) {
//             // Sign-in was successful
//             return response.json();
//           } else {
//             // Sign-in failed
//             return response.json().then((data) => Promise.reject(data));
//           }
//         })
//         .then((data) => {
//           // Sign-in succeeded
//           console.log('Sign-in successful:', data);
//           // Redirect to the home page
//           window.location.href = '/home/index.html';
//         })
//         .catch((error) => {
//           // Sign-in failed, handle the error
//           console.error('Sign-in error:', error);
//         });
//     });
//   });