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

  static async getAccounts(banks, statuses, currencies) {
    const response = await axios.get('/api/wealth/accounts', {
      params: {
        banks,
        statuses,
        currencies
      }
    });
    return response.data;
  }

  static async getAccount(id) {
    const response = await axios.get('/api/wealth/accounts/'+id);
    return response.data;
  }

  static async addNewAccount(bankCode, accountNumber, currencyCode, startBalance){
    return await axios.post('/api/wealth/accounts', {
      accountNumber: accountNumber,
      accountStartBalance: startBalance,
      accountBankCode: bankCode,
      accountCurrency: currencyCode,
    });
  }

  static async updateAccount(id, accountNumber, startBalance, status){
    return await axios.put('/api/wealth/accounts/'+id, {
      accountNumber: accountNumber,
      accountStartBalance: startBalance,
      accountStatus: status
    });
  }

  static async deleteAccount(id){
    return await axios.delete('/api/wealth/accounts/'+id);
  }
}

export default AccountRequest;
