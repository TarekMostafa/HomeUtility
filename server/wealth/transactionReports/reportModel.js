const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const ReportDetailModel = require('./reportDetailModel');

class ReportModel extends Sequelize.Model {}
ReportModel.init({
  reportId: { type: Sequelize.INTEGER(11), primaryKey: true },
  reportName: Sequelize.STRING(45),
  reportActive: Sequelize.ENUM('YES', 'NO'),
}, {
  tableName: 'reports',
  createdAt: false,
  updatedAt: false,
  sequelize
});

ReportModel.hasMany(ReportDetailModel, {
  as: "reportdetails",
  foreignKey: 'detailReportId'
});

module.exports = ReportModel;
