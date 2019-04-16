import axios from 'axios';

class UserRequest {
  static async authenticate(userName, password) {
    return await axios.post('/api/users/authenticate', {
      userName, password
    });
  }

  static async changePassword(userId, oldPassword, newPassword) {
    return await axios.post('/api/users/changepassword', {
      userId, oldPassword, newPassword
    });
  }
}

export default UserRequest;
