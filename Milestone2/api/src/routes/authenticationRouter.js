const express = require("express");
const router = express.Router();
const {TokenMiddleware, generateToken, removeToken} = require('../middleware/TokenMiddleware');
const userDao = require('../accessObjects/userDao');

router.get('/', TokenMiddleware, (req, res) => { // base API path, testing
    res.json({your_api: 'it works'});
});

//register, add a user
router.post('/register', (req, res) => {

    userDao.addUser(req.body).then(result => { // try adding
        generateToken(req, res, result);
        res.json(result);
    }).catch(error => {
        res.status(401).json({error: error}); //catch and send error
    })
});

//login in user
router.post('/:userID/login', (req, res) => {
    let username = req.body.username.trim();
    let password = req.body.password.trim();
    if(username == "" || password == "") { // user cannot be empty
        res.status(400).json({error: "fields cannot be empty!"});
    }
    else {
        UserDAuserDao.getUserByCredentials(username, password).then(user => { // find user
            generateToken(req, res, user);
            res.json({result: 'success'});
        }).catch(error => {
            res.status(401).json({error: error});
        });
    } 
});

router.post('/:userID/logout', (req, res) => {
    removeToken(req, res);
    res.json({message: "success"});
});

router.get('/:userID/current', AuthenticationMiddleware, (req, res) => {
    res.json({message: 'success', user: req.user});
})

module.exports = router;