const jwt = require('jsonwebtoken');

const TOKEN_COOKIE_NAME = "DoggieWriggle";

const API_SECRET = process.env.API_SECRET_KEY;

exports.TokenMiddleware = (req, res, next) => {
  let token = null;
  if(!req.cookies[TOKEN_COOKIE_NAME]) {
    const authHeader = req.get('Authorization');
    if(authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }
  else { 
    token = req.cookies[TOKEN_COOKIE_NAME]; 
  }

  if(!token) { 
    res.status(401).json({error: 'Not authenticated'});
    return;
  }

  //If we've made it this far, we have a token. We need to validate it

  try {
    const decoded = jwt.verify(token, API_SECRET);
    req.userID = decoded.userID;
    next(); //Make sure we call the next middleware
  }
  catch(err) { //Token is invalid
    res.status(401).json({error: 'Not authenticated or token expired'});
    return;
  }
}

exports.generateToken = (req, res, userID) => {
  let data = {
    userID: userID,
    // Use the exp registered claim to expire token in 1 hour
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  }

  const token = jwt.sign(data, API_SECRET);

  //send token in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 2 * 60 * 1000 //This session expires in 2 minutes.. but token expires in 1 hour!
  });
};

exports.removeToken = (req, res) => {
  //send session ID in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000 //A date in the past
  });

}