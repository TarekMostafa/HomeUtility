const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();

class ReportDetailModel extends Sequelize.Model {}
ReportDetailModel.init({
  detailId: { type: Sequelize.INTEGER(11), primaryKey: true },
  detailReportId: Sequelize.INTEGER(11),
  detailName: Sequelize.STRING(45),
  detailTypes: Sequelize.STRING(200),
  detailLabel1: Sequelize.STRING(200),
  detailLabel2: Sequelize.STRING(200),
  detailLabel3: Sequelize.STRING(200),
  detailLabel4: Sequelize.STRING(200),
  detailLabel5: Sequelize.STRING(200),
}, {
  tableName: 'reportdetails',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = ReportDetailModel;
