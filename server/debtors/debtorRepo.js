const DebtorModel = require('./debtorModel');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/currencyModel');
const Exception = require('../features/exception');

class DebtorRepo {
  static async getDebtors({currency, status}) {
    var query = {};
    if(currency) query.detbCurrency = currency;
    if(status) query.debtStatus = status;
    return await DebtorModel.findAll({
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace', 
        'currencyRateAgainstBase', 'currencyManualRateAgainstBase'] },
      ],
      where: query,
      order: [ ['debtName', 'ASC'] ]
    });
  }

  static async getDebtor(id) {
    return await DebtorModel.findByPk(id, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
      ]
    });
  }

  static async addDebtor(debtor, dbTransaction) {
    return await DebtorModel.build(debtor).save({transaction: dbTransaction});
  }

  static async saveDebtor(debtor, dbTransaction) {
    return await debtor.save({transaction: dbTransaction});
  } 

  static async deleteDebtor(debtor, dbTransaction) {
    return await debtor.destroy({transaction: dbTransaction});
  }

  static async updateDebtorBalance(id, amount, dbTransaction) {
    let debtor = await this.getDebtor(id);
    if(!debtor) throw new Exception('DEBT_NOT_EXIST');
    await debtor.update({
        debtBalance: sequelize.literal('debtBalance+'+Number(amount)),
        debtLastBalanceUpdate: sequelize.fn('NOW')
    }, {transaction: dbTransaction});
  }

  static async getDebtorByRelId(relId){
    return await DebtorModel.findOne({
      where: {
        debtRelId: relId
      }
    })
  }
}

module.exports = DebtorRepo;
