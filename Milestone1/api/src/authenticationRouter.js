const express = require("express");
const router = express.Router();

router.post('/signin', (req, res) => {
    if (req.body.userName == "user1234" && req.body.password == "password1234")
        res.send({"token" : "afj93sfjkljawef"});
    else {
        res.status(403);
        res.send({"error" : "wrong username or password"});
    }
})

module.exports = router;