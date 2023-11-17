const express = require("express");
const tk = require('../middleware/TokenMiddleware');
const tagDao = require('../accessObjects/tagDao');
const router = express.Router();

router.get('/', tk.TokenMiddleware, (req, res) => {
    tagDao.getTagsByUser(req.userID).then(tags => {
        res.send(tags);
    });
});

router.post('/', tk.TokenMiddleware, (req, res) => {
    tagDao.createTag(req.userID, req.body.tagName).then(id => {
        res.send({"tagID" : id});
    });
});

router.delete('/:tagID', tk.TokenMiddleware, (req, res) => {
    tagDao.deleteTag(req.params.tagID).then(() => res.send({}));
});

module.exports = router;