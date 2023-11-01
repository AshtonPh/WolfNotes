import '@material/web/button/filled-button'
// Get the reference to the img-container element'
document.addEventListener("DOMContentLoaded", function() {
    // Function to validate the registration form
    function validateForm() {
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const passwordConfirmation = document.getElementById("password-confirmation").value;
        const passwordError = document.getElementById("password-error");
        const formError = document.getElementById("form-error");

        // Reset any previous error messages
        passwordError.textContent = "";
        formError.textContent = "";

        // Check for empty fields
        if (!email || !username || !password || !passwordConfirmation) {
            formError.textContent = "Please fill in all the fields.";
            return false;
        }

        // Check if passwords match
        if (password !== passwordConfirmation) {
            passwordError.textContent = "Passwords do not match!";
            return false;
        }

        return true; // Form is valid, allow submission
    }

    // Attach the validateForm function to the form's onsubmit event
    const registrationForm = document.getElementById("registration-form");
    registrationForm.onsubmit = validateForm;
});