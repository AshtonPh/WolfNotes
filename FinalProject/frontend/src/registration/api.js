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


