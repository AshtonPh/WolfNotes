function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic frontend validation
    if (!username || !password || !confirmPassword) {
        alert('All fields are required');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const userData = {
        username: username,
        password: password
    };

    // Send the user data to the backend for registration
    fetch('/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // redirect to a different page upon successful registration
        window.location.href = '/login';
    })
    .catch(error => console.error('Error:', error));
}