// document.getElementById('submit').addEventListener('click', function(event) {
//     event.preventDefault();
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     // Regular expressions for validation
//     const usernamePattern = /^[a-zA-Z]+[a-zA-Z0-9]*\d$/;
//     const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

//     if (!usernamePattern.test(username)) {
//         // Username doesn't match the pattern
//         alert('Username must start with letters and end with digits.');
//         return;
//     }

//     if (!passwordPattern.test(password)) {
//         // Password doesn't match the pattern
//         alert('Password must be at least 8 characters long and contain letters and numbers.');
//         return;
//     }

//     // Simulate an API call to authenticate the user.
//     // Replace this with future actual authentication logic.
//     // For this example, we assume authentication is successful.

//     const token = 'afj93sfjkljawef'; // Replace with the actual token.

//     // Store the token in a cookie.
//     document.cookie = `token=${token}; path=/`;

//     // Redirect to the home page after successfully log in 
//     window.location.href = '/home/index.html';
// });