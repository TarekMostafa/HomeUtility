const Sequelize = require('sequelize');
const Common = require('../../utilities/common');
const APIResponse = require('../../utilities/apiResponse');
const RelatedTransactionRepo = require('./RelatedTransactionRepo');

const Op = Sequelize.Op;

class RelatedTransaction {

  async getRelatedTransactions({limit, skip, type,
    description, id, includeDescription}) {

    let _limit = Common.getNumber(limit, 10);
    let _skip = Common.getNumber(skip, 0);
    // Construct Where Condition
    let whereQuery = {};
    // Type
    if(type) {
      whereQuery.relatedTransactionType = type;
    }
    // Description
    if(description) {
      if(includeDescription==='true') {
        whereQuery.relatedTransactionDesc = {
          [Op.substring] : description
        }
      } else {
        whereQuery.relatedTransactionDesc = {
          [Op.notLike] : '%'+description.trim()+'%'
        }
      }
    }
    //Related Transaction Id
    if(id){
      whereQuery.relatedTransactionsId = id;
    }

    const relatedTransactions = await RelatedTransactionRepo.getRelatedTransactions(_skip, _limit, whereQuery);
    return APIResponse.getAPIResponse(true, relatedTransactions);
  }

  async getRelatedTransactionsDetails({id}) {
    const relatedTransactionsByDetails = await RelatedTransactionRepo.getRelatedTransactionsById(id);
    return APIResponse.getAPIResponse(true, relatedTransactionsByDetails);
  }
}

module.exports = RelatedTransaction;
