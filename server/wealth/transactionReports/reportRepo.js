const ReportModel = require('./reportModel');
const ReportDetailModel = require('./reportDetailModel');

class ReportRepo {
  static async getSimpleReports() {
    return await ReportModel.findAll({
      attributes: ['reportId', 'reportName'],
      where: {reportActive: 'YES'}
    });
  }

  static async getReport(id) {
    return await ReportModel.findByPk(id, {
      include: [
        { model: ReportDetailModel, as: 'reportdetails' }
      ],
      where: {reportActive: 'YES'}
    });
  }
}

module.exports = ReportRepo;
