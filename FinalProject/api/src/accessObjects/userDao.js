const User = require('./models/User');
const db = require('./connectionProvider');
const crypto = require('crypto');

const ITERATIONS = 100000;

const KEYLEN = 64;

const DIGEST = 'sha512';

function getUserById(id){ // get a user by id
  return db.query('SELECT * FROM User WHERE userID=?', [id]).then(({results}) => {
      const user = new User(results[0]);
      if(user) {
          return user.toJSON();
      }
      else {
          throw new Error("Could not get a user");
      }
  })
}

// if an user already exist in the database
function userExists(username) {
  return db.query('SELECT * FROM User WHERE userName = ?', [username])
    .then(({ results }) => {
      console.log('User Exists Check:', results);
      return results.length > 0;
    });
}

function addUser(userData) {
  let salt = crypto.randomBytes(16).toString('hex');
  let key = crypto.pbkdf2Sync(userData.password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  
  console.log('Generated Salt:', salt);
  console.log('Generated Key:', key);
  console.log('User Data:', userData);

  const avatarUrl = `https://robohash.org/${userData.username}.png?size=64x64&set=set1`;

  return userExists(userData.username)
    .then(exists => {
      if (exists) {
        throw new Error('User with the same username already exists');
      }

      // Proceed with user creation
      return db.query(
        'INSERT INTO User (userName, avatar, passwordHash, salt) VALUES (?, ?, ?, ?)',
        [userData.username, avatarUrl, key, salt]
      );
    })
    .then(({ results }) => {
      console.log('User Added Successfully:', results);
      return getUserById(results.insertId);
    })
    .catch(error => {
      if (error.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry error
        console.error('Duplicate entry error:', error.message);
      } else {
        // Handle other errors
        console.error('Error Adding User:', error);
      }
      throw error; // Re-throw the error for handling at a higher level if needed
    });
}

function getUserByCredentials(username, password) {
    return db.query('SELECT * FROM User WHERE userName=?', [username]).then(({results}) => {
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