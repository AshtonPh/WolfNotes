const User = require('./models/User');
const db = require('./connectionProvider');
const crypto = require('crypto');

const ITERATIONS = 100000;

const KEYLEN = 64;

const DIGEST = 'sha512';

function getUserById(id){ // get a user by id
  return db.query('SELECT * FROM users WHERE user_id=?', [id]).then(({results}) => {
      const user = new User(results[0]);
      if(user) {
          return user.toJSON();
      }
      else {
          throw new Error("Could not get a user");
      }
  })
}

function addUser(userData){ // add a user
  let salt = crypto.randomBytes(16).toString('hex');
  let key = crypto.pbkdf2Sync(userData.password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  console.log(key);
  console.log(userData);
  return db.query('INSERT INTO users (userID, userName, avatar, salt, passwordHash) VALUES (NULL, ?, ?, ?, ?)',
  [userData.username, userData.email, salt, key, userData.displayname, `https://robohash.org/${userData.username}.png?size=64x64&set=set1`]).then(({results}) => {
      return getUserById(results.insertId);
  })

}

function getUserByCredentials(username, password) {
    return db.query('SELECT * FROM user WHERE userName=?', [username]).then(({results}) => {
      const user = new User(results[0]);
      if (user) { // we found our user
        console.log(user);
        console.log(user.validatePassword(password));
        return user.validatePassword(password);
        
      }
      else { // if no user with provided username
        throw new Error("No such user");
      }
    });
  }
  
 //expose our userDAO 
  module.exports = {
    getUserById,
    addUser,
    getUserByCredentials
  };