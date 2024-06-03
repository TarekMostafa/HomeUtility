import axios from 'axios';

class ReportRequest {
  static async getReportsForDropDown () {
    const response = await axios.get('/api/wealth/reports/dropdown');
    return response.data;
  }

  static async getReportDetails(reportId) {
    const response = await axios.get('/api/wealth/reports/reportDetails/'+reportId);
    return response.data;
  }

  static async editReport(id, reportName, crTransTypes, drTransTypes) {
    return await axios.post('/api/wealth/reports/editReport/'+id, {
      reportName, crTransTypes, drTransTypes
    });
  }

  static async deleteReport(id) {
    return await axios.post('/api/wealth/reports/deleteReport/'+id);
  }

  static async addNewReport(reportName, crTransTypes, drTransTypes) {
    return await axios.post('/api/wealth/reports/addNewReport', {
      reportName, crTransTypes, drTransTypes
    });
  }
}

export default ReportRequest;
