function mw(req, res, next) {
    req.userID = 1;
    next();
}

module.exports = {mw};