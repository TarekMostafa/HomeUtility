import axios from 'axios';

class AccountRequest {
  static async getAccountsForDropDown () {
    const response = await axios.get('/api/wealth/accounts/dropdown');
    return response.data;
  }
}

export default AccountRequest;
