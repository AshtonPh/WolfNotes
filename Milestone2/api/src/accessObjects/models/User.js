const crypto = require('crypto');

module.exports = class {
  userID = null;
  userName = null;
  avatar = null;
  #passwordHash = null;;
  #salt = null;;

  constructor(data) {
    this.id = data.userID;
    this.userName = data.userName;
    this.avatar = data.avatar;
    this.#salt = data.salt;
    this.#passwordHash = data.passwordHash;
  }

  validatePassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) { //problem computing digest, like hash function not available
         reject("Error: " +err);
        }

        const digest = derivedKey.toString('hex');
        if (this.#passwordHash == digest) {
          resolve(this);
        }
        else {
          reject("Invalid username or password");
        }
      });
    });
  }

  toJSON() {
    return {
      userID: this.userID,
      userName: this.userName,
      avatar: this.avatar
    }
  }
};