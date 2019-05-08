import axios from 'axios';

class DBRequest {
  static async backup() {
    return await axios.post('/api/db/backup');
  }
}

export default DBRequest;
