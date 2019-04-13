import axios from 'axios';

class UserRequest {
  static async authenticate(userName, password) {
    return await axios.post('/api/users/authenticate', {
      userName, password
    });
  }
}

export default UserRequest;
