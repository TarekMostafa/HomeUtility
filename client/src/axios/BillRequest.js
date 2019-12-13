import axios from 'axios';

class BillRequest {
  static async getBillsForDropDown () {
    const response = await axios.get('/api/bills/dropdown');
    return response.data;
  }

  static async getBillStatuses () {
    const response = await axios.get('/api/bills/billstatuses');
    return response.data;
  }

  static async getBillFrequencies () {
    const response = await axios.get('/api/bills/billfrequencies');
    return response.data;
  }

  static async getBills(status) {
    const response = await axios.get('/api/bills', {
      params: {
        status
      }
    });
    return response.data;
  }

  static async getBill(id) {
    const response = await axios.get('/api/bills/'+id);
    return response.data;
  }

  static async getCountOfBillItemUsed(billItemId) {
    const response = await axios.get('/api/bills/getCountOfBillItemUsed/'+billItemId);
    return response.data;
  }

  static async addNewBill(name, frequency, currency, startDate, defaultAmount, isRequired, items){
    return await axios.post('/api/bills', {
      billName: name,
      billFrequency: frequency,
      billCurrency: currency,
      billStartDate: startDate,
      billDefaultAmount: defaultAmount,
      billIsTransDetailRequired: isRequired,
      items: items
    });
  }

  static async updateBill(id, name, frequency, startDate, defaultAmount, status, isRequired, billItems){
    return await axios.put('/api/bills/'+id, {
      billName: name,
      billFrequency: frequency,
      billStartDate: startDate,
      billDefaultAmount: defaultAmount,
      billStatus: status,
      billIsTransDetailRequired: isRequired,
      billItems: billItems
    });
  }

  static async deleteBill(id){
    return await axios.delete('/api/bills/'+id);
  }
}

export default BillRequest;
