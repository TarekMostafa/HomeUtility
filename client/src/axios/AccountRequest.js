import axios from 'axios';

class AccountRequest {
  static async getAccountsForDropDown () {
    const response = await axios.get('/api/wealth/accounts/dropdown');
    return response.data;
  }

  static async getAccountStatuses () {
    const response = await axios.get('/api/wealth/accounts/accountstatuses');
    return response.data;
  }

  static async getAccounts(bank, status) {
    const response = await axios.get('/api/wealth/accounts', {
      params: {
        bank,
        status
      }
    });
    return response.data;
  }

  static async getAccount(id) {
    const response = await axios.get('/api/wealth/accounts/'+id);
    return response.data;
  }

  static async addNewAccount(bankCode, accountNumber, currencyCode, startBalance, userId){
    return await axios.post('/api/wealth/accounts', {
      accountNumber: accountNumber,
      accountStartBalance: startBalance,
      accountBankCode: bankCode,
      acccountCurrency: currencyCode,
      accountUser: userId,
    });
  }

  static async updateAccount(id, accountNumber, startBalance, status){
    return await axios.put('/api/wealth/accounts/'+id, {
      accountNumber: accountNumber,
      accountStartBalance: startBalance,
      accountStatus: status
    });
  }

  static async deleteAccount(id, accountNumber, startBalance, status){
    return await axios.delete('/api/wealth/accounts/'+id);
  }
}

export default AccountRequest;
