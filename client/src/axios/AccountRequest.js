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

  static async addNewAccount(bankCode, accountNumber, currencyCode, startBalance, userId){
    return await axios.post('/api/wealth/accounts', {
      accountNumber: accountNumber,
      accountStartBalance: startBalance,
      accountBankCode: bankCode,
      acccountCurrency: currencyCode,
      accountUser: userId,
    });
  }
}

export default AccountRequest;
