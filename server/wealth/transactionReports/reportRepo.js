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

  static async getReportByName(reportName) {
    return await ReportModel.findOne({where: {reportName: reportName}})
  }

  static async AddReport(report, {dbTransaction}) {
    return await ReportModel.build(report).save({transaction: dbTransaction});
  }

  static async AddReportDetail(reportDetail, {dbTransaction}) {
    return await ReportDetailModel.build(reportDetail).save({transaction: dbTransaction});
  }
}

module.exports = ReportRepo;
