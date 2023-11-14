import api from './APIClient.js';

const loginButton = document.querySelector('#submit');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const errorBox = document.querySelector('#form-error');

//Redirect if the user already logged in
api.getCurrentUser().then(user => {
  //If got some user then this page shouldn't be visible, redirect
  document.location = '/home/index.html';
}).catch(error => {
  //Otherwise do nothing
});


loginButton.addEventListener('click', e => {

  errorBox.classList.add("hidden");

  api.logIn(username.value, password.value).then(userData => {
    document.location = "/home/index.html";
  }).catch((err) => {

    errorBox.classList.remove("hidden");
    if(err.status === 401) {
      errorBox.innerHTML = "Invalid username or password";
    }
    else {
      errorBox.innerHTML = err;
    }
  });
});
