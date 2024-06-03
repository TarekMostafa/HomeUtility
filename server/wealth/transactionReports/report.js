const ReportRepo = require('./reportRepo');
const sequelize = require('../../db/dbConnection').getSequelize();
const Exception = require('../../features/exception');

class Report {
  async getReportsForDropDown() {
    let reports = await ReportRepo.getSimpleReports();
    reports = reports.map( report => {
      return {
        reportId: report.reportId,
        reportName: report.reportName
      }
    });
    return reports;
  }

  async getReportDetails(id) {
    let report = await ReportRepo.getReport(id);
    const details = report.reportdetails;
    report = {
      reportId: report.reportId,
      reportName: report.reportName,
      transTypesCR: '',
      transTypesDR: '',
    }

    for(let index = 0; index < details.length; index++) {
      let detail = details[index];
      if(detail.detailName === 'Credit')
        report.transTypesCR = detail.detailTypes;
      else if(detail.detailName === 'Debit')
        report.transTypesDR = detail.detailTypes;
    }

    return report;
  }

  async addNewReport({reportName, crTransTypes, drTransTypes}) {
    let report = await ReportRepo.getReportByName(reportName);
    if(report) {
      throw new Exception('REPORT_EXIST');
    }

    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      const report = await ReportRepo.AddReport({
        reportName: reportName,
        reportActive: 'YES'
      }, dbTransaction);

      await ReportRepo.AddReportDetail({
        detailReportId: report.reportId,
        detailName: "Credit",
        detailTypes: crTransTypes
      }, dbTransaction);

      await ReportRepo.AddReportDetail({
        detailReportId: report.reportId,
        detailName: "Debit",
        detailTypes: drTransTypes
      }, dbTransaction);

      await dbTransaction.commit(); 
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback(); 
      throw new Exception('REPORT_ADD_FAIL');
    }
  }

  async editReport(id, {reportName, crTransTypes, drTransTypes}) {
    let report = await ReportRepo.getReport(id);
    if(!report) {
      throw new Exception('REPORT_INVALID');
    }

    let details = report.reportdetails;
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      report.reportName = reportName;
      await report.save({transaction: dbTransaction});

      for(let index = 0; index < details.length; index++) {
        let detail = details[index];
        if(detail.detailName === 'Credit') {
          detail.detailTypes = crTransTypes;
        } else if(detail.detailName === 'Debit') {
          detail.detailTypes = drTransTypes;
        }
        await detail.save({transaction: dbTransaction});
      }

      await dbTransaction.commit();
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('REPORT_UPDATE_FAIL');
    }
  }

  async deleteReport(id) {
    let report = await ReportRepo.getReport(id);
    if(!report) {
      throw new Exception('REPORT_INVALID');
    }

    let details = report.reportdetails;
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      for(let index = 0; index < details.length; index++) {
        let detail = details[index];
        await detail.destroy({transaction: dbTransaction});
      }

      await report.destroy({transaction: dbTransaction});

      await dbTransaction.commit();
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('REPORT_DELETE_FAIL');
    }
  }
}

module.exports = Report;
