import APIClient from './APIClient.js';


const registerButton = document.querySelector('#submit');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#passwordConfirm');
const errorBox = document.querySelector('#form-error');

registerButton.addEventListener('click', e =>{
    e.preventDefault();
    errorBox.classList.add("hidden");
    console.log(username.value);
    console.log(password.value);
    console.log(confirmPassword.value);
    APIClient.register(username.value, password.value, confirmPassword.value)
    .then(userData => {
      console.log(userData);
      window.location.href = "/";
    })
    .catch(err => {
      errorBox.classList.remove("hidden");
      errorBox.textContent = "Error during registration: " + (err.message || "Please try again.");
    });

});


// document.addEventListener('DOMContentLoaded', function () {
//     const registrationForm = document.getElementById('registration-form');
//     registrationForm.addEventListener('submit', function (event) {
//       event.preventDefault();
  
//       // Get form input values
//       const username = document.getElementById('username').value;
//       const password = document.getElementById('password').value;
//       const email = document.getElementById('email').value;

//       // Define the API endpoint URL
//      const apiUrl = 'http://localhost:3501/registration/';
  
//       // Create an object with the registration data
//       const registrationData = {
//         username,
//         password,
//         email,
//       };
  
//       // Send a POST request to the registration endpoint
//       fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(registrationData),
//       })
//         .then((response) => {
//           if (response.ok) {
//             // Registration was successful
//             return response.json();
//           } else {
//             // Registration failed
//             return response.json().then((data) => Promise.reject(data));
//           }
//         })
//         .then((data) => {
//           // Registration succeeded
//           console.log('Registration successful:', data);
//           // Redirect to the home page
//           window.location.href = '/home';
//         })
//         .catch((error) => {
//           // Registration failed, handle the error
//           console.error('Registration error:', error);
//         });
//     });
//   });