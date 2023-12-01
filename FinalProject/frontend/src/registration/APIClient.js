import HTTPClient from "./HTTPClient.js";

const API_BASE = '/api';

export default {

  register: (username, password, confirmPassword) => {
    let data = {
        username: username,
        password: password,
        confirmPassword: confirmPassword
    }
    return HTTPClient.post(API_BASE + '/auth/registration', data);
}
};