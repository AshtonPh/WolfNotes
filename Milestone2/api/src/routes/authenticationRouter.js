const express = require("express");
const router = express.Router();
const {TokenMiddleware, generateToken, removeToken} = require('../middleware/TokenMiddleware');
const userDao = require('../accessObjects/userDao');

router.get('/', TokenMiddleware, (req, res) => { // base API path, testing
    res.json({your_api: 'it works'});
});

//register, add a user
router.post('/register', (req, res) => {

    userDao.addUser(req.body).then(result => { // try adding  a user
        generateToken(req, res, result);
        res.json(result);
    }).catch(error => {
        res.status(400).json({error: error}); //catch and send error
    })
});

//users login in 
router.post('/:userID/login', (req, res) => {
    let userName = req.body.userName.trim();
    let passwordHash = req.body.passwordHash.trim();
    if(userName == "" || passwordHash == "") { // user cannot be empty
        res.status(400).json({error: "fields cannot be empty!"});
    }
    else {
        userDao.getUserByCredentials(userName, passwordHash).then(user => { // find user to see if they exist 
            generateToken(req, res, user);
            res.json({result: 'Logged in'});
        }).catch(error => {
            //user does not exist or the user password and username does not match
            res.status(401).json({error: error});
        });
    } 
});

//users log out
router.post('/:userID/logout', (req, res) => {
    removeToken(req, res);
    res.json({message: "Logged out"});
});

router.get('/:userID/current', TokenMiddleware, (req, res) => {
    res.json({message: 'success', user: req.user});
})

module.exports = router;