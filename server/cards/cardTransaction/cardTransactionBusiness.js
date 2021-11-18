const CardTransactionRepo = require('./cardTransactionRepo');
const CardRepo = require('../cardRepo');
const Exception = require('../../features/exception');
const sequelize = require('../../db/dbConnection').getSequelize();

class CardTransactionBusiness {
  async getCardsTransactions({cardId, cardInstId}) {
    return await CardTransactionRepo.getCardsTransactions({cardId, cardInstId});
  }

  async getCardTransaction(id) {
    return await CardTransactionRepo.getCardTransaction(id);
  }
}

module.exports = CardTransactionBusiness;
