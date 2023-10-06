const express = require("express");
const router = express.Router();


//register user
router.post('/register', (req, res) => {
    if (req.body.userName == "user1234" && req.body.password == "password1234"
        &&req.body.email == "user@ncsu.edu")
        //a dummy token if it is successful registeration 
        res.send({"token" : "afj93sfjkljawef"});
    else {
        res.status(403);
        res.send({"error" : "invalid email address"});
    }
});


// user sign in 
router.post('/signin', (req, res) => {
    if (req.body.userName == "user1234" && req.body.password == "password1234")
        //a dummy token if it is successful sign in 
        res.send({"token" : "afj93sfjkljawef"});
    else {
        res.status(403);
        res.send({"error" : "wrong username or password"});
    }
});

// user agreement acceptance
router.post('/user-agreement', (req, res) => {
    if (req.body.userID == "1234" && req.body.accpeted == 'true'){
        res.send(200);
        res.send({"message" : "User agreement accepted sucessfully"});
    } else {
        res.status(403);
        res.send({"error" : "Invalid request"});
    }
    
});

// user settings(institution and current courses)
router.post('/user-settings', (req, res) => {
    const {Insitution , 'current-courses' : currentCouses} = req.body;

    //do not have ideas for these yet so we just assume it is valid no matter what 

    res.status(200);
    //don't know what I should responding to 
    res.send({});
    
});

// user profile setting 
router.post('/user-profile', (req, res) => {
    const {'user-profile' : userProfile} = req.body;

    //do not have ideas for these yet so we just assume it is valid no matter what 

    res.status(200);
    //don't know what I should responding to 
    res.send({});
    
});

module.exports = router;