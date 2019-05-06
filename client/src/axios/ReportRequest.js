import axios from 'axios';

class ReportRequest {
  static async getReportsForDropDown () {
    const response = await axios.get('/api/wealth/reports/dropdown');
    return response.data;
  }
}

export default ReportRequest;
