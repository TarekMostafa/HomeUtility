import axios from 'axios';

class UserRequest {
  static async authenticate(userName, password) {
    return await axios.post('/free/users/authenticate', {
      userName, password
    });
  }

  static async tokenauthentication(userToken) {
    return await axios.post('/free/users/tokenauthentication', {
      userToken
    });
  }

  static async logout(userId) {
    return await axios.post('/free/users/logout', {
      userId
    });
  }

  static async changePassword(userId, oldPassword, newPassword) {
    return await axios.post('/free/users/changepassword', {
      userId, oldPassword, newPassword
    });
  }

  static async changeUserName(userId, userName) {
    return await axios.post('/free/users/changeusername', {
      userId, userName
    });
  }
}

export default UserRequest;
