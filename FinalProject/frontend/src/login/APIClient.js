import HTTPClient from "./HTTPClient.js";

const API_BASE = '/api';

export default {
  getCurrentUser: () => {
    return HTTPClient.get(API_BASE + '/auth/current');
  },

  logIn: (username, password) => {
    let data = {
      username: username,
      password: password
    }
    console.log('\nAPIClient.js --> username = ' + username);
    console.log('\nAPIClient.js --> password = ' + password);
    return HTTPClient.post(API_BASE + '/auth/login', data);
  },

  logOut: () => {
    return HTTPClient.post(API_BASE + '/auth/logout', {});
  }
};