const ReportRepo = require('./reportRepo');
const APIResponse = require('../../utilities/apiResponse');

class Report {
  async getReportsForDropDown() {
    const reports = await ReportRepo.getSimpleReports();
    return APIResponse.getAPIResponse(true, reports);
  }
}

module.exports = Report;
