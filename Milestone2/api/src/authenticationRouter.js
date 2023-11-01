const express = require("express");
const router = express.Router();


// Mock database for user registration and authentication
const users = [
  { userName: "user1234", password: "password1234", email: "user@ncsu.edu" },
];

// Mock user agreement acceptance
const acceptedAgreements = [];

// Mock user settings and user profiles
const userSettings = {};
const userProfiles = {};

// Register User
router.post("/register", (req, res) => {
  const { userName, password, email } = req.body;

  // Check if the user already exists
  const existingUser = users.find(
    (user) => user.userName === userName || user.email === email
  );

  if (existingUser) {
    res.status(409).send({ error: "User already exists" });
  } else {
    // Add the user to the mock database 
    // TODO:should use a real database later in the implementation
    users.push({ userName, password, email });

    // Respond with a token 
    // TODO: should implement proper authentication
    const token = "afj93sfjkljawef"; // Replace with actual token generation logic
    res.cookie("token", token, { httpOnly: true }); // Set the 'httpOnly' option for security

    // Redirect to the home page after successful registration
    res.redirect("/home/index.html")
  }
});

// User Sign-In
router.post("/signin", (req, res) => {
  const { userName, password } = req.body;

  // Check if the user credentials are valid
  // TODO: should use a real database
  const user = users.find(
    (u) => u.userName === userName && u.password === password
  );

  if (user) {
    // Generate a token (you should use a proper token library)
    const token = "afj93sfjkljawef"; // Replace with actual token generation logic

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true }); // Set the 'httpOnly' option for security

    // Redirect to the home page after successful sign-in
    res.redirect("/home/index.html");
  } else {
    res.status(401).send({ error: "Invalid username or password" });
  }
});

// User Agreement Acceptance
router.post("/user-agreement", (req, res) => {
  const { userID, accepted } = req.body;

  // Check if the user ID exists 
  // TODO:should use a real database
  const userExists = users.some((user) => user.userName === userID);

  if (userExists && accepted === true) {
    // Store user agreement acceptance 
    //TODO: use a real database later 
    acceptedAgreements.push(userID);

    res.status(200).send({ message: "User agreement accepted successfully" });
  } else {
    res.status(400).send({ error: "Invalid request data" });
  }
});

// User Settings
router.post("/user-settings", (req, res) => {
  const { userName, institution, currentCourses } = req.body;

  // Store user settings 
  //TODO: use a real database
  userSettings[userName] = { institution, currentCourses };

  res.status(200).send({ message: "User settings updated successfully" });
});

// User Profile Setting
router.post("/user-profile", (req, res) => {
  const { userName, userProfile } = req.body;

  // Store user profile settings 
  //TODO:  use a real database
  userProfiles[userName] = userProfile;

  res.status(200).send({ message: "User profile updated successfully" });
});

router.get("/user-profile/:userName/picture", (req, res) => {
  const { userName } = req.params;

  // Check if the user profile picture exists 
  // TODO: use a real storage system later
  if (userProfiles[userName] && userProfiles[userName].pictureUrl) {
    // Send the user profile picture
    res.sendFile(userProfiles[userName].pictureUrl);
  } else {
    res.status(404).send({ error: "Profile picture not found" });
  }
});

module.exports = router;