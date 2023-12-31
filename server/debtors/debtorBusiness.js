const DebtorRepo = require('./debtorRepo');
const Exception = require('../features/exception');
const sequelize = require('../db/dbConnection').getSequelize();
const RelatedTransactionRepo = require('../wealth/relatedTransactions/relatedTransactionRepo');

const DEBTOR_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED'
}

class DebtorBusiness {
  async getDebtors({currency, status}) {
    let debtors = await DebtorRepo.getDebtors({currency, status});
    debtors = debtors.map(debtor => {
      return  {
        Id: debtor.debtId,
        Name: debtor.debtName,
        Currency: debtor.debtCurrency,
        Balance: debtor.debtBalance,
        Status: debtor.debtStatus,
        Notes: debtor.debtNotes,
        LastBalanceUpdate: debtor.debtLastBalanceUpdate,
        CurrencyDecimalPlace: debtor.currency.currencyDecimalPlace,
        RelId: debtor.debtRelId,
      }
    });
    return debtors;
  }

  async getDebtor(id) {
    let debtor = await DebtorRepo.getDebtor(id);
    debtor = {
        Id: debtor.debtId,
        Name: debtor.debtName,
        Currency: debtor.debtCurrency,
        Balance: debtor.debtBalance,
        Status: debtor.debtStatus,
        Notes: debtor.debtNotes,
        LastBalanceUpdate: debtor.debtLastBalanceUpdate,
        CurrencyDecimalPlace: debtor.currency.currencyDecimalPlace,
        RelId: debtor.debtRelId,
    }
    return debtor;
  }

  async addDebtor({debtName, debtCurrency, debtNotes}) {
    // begin transaction
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      // create new debtor 
      let debtor = await DebtorRepo.addDebtor({
        debtName,
        debtCurrency,
        debtBalance: 0,
        debtStatus: DEBTOR_STATUS.ACTIVE,
        debtNotes,
        debtLastBalanceUpdate: null,
        debtRelId: null,
      }, dbTransaction);
      // create new related transaction
      let relatedTransaction = {
        relatedTransactionType: 'DBT',
        relatedTransactionDesc: this.getDescription(debtName, debtCurrency)
      }
      relatedTransaction = await RelatedTransactionRepo.addRelatedTransaction(relatedTransaction, dbTransaction);
      // update debtor related transaction Id
      debtor.debtRelId = relatedTransaction.relatedTransactionsId;
      await DebtorRepo.saveDebtor(debtor, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('DEBT_ADD_FAIL');
    }
  }

  async updateDebtor(id, {debtName, debtNotes, debtStatus}) {
    let debtor = await DebtorRepo.getDebtor(id);
    if(!debtor) throw new Exception('DEBT_NOT_EXIST');

    if (debtStatus === DEBTOR_STATUS.CLOSED){
      if(debtor.debtBalance != 0){
        throw new Exception('DEBT_CLOSE_BALANCE');
      }
    }

    // begin transaction
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      const savedDebtorName = debtor.debtName;
      // update debtor
      debtor.debtName = debtName;
      debtor.debtNotes = debtNotes;
      debtor.debtStatus = debtStatus;
      await DebtorRepo.saveDebtor(debtor, dbTransaction);
      // update related transaction
      if(debtor.debtRelId &&  savedDebtorName !== debtName){
        let relatedTransaction = await RelatedTransactionRepo.getRelatedTransaction(debtor.debtRelId);
        relatedTransaction.relatedTransactionDesc = this.getDescription(debtName, debtor.debtCurrency);
        await RelatedTransactionRepo.saveRelatedTransaction(relatedTransaction, dbTransaction);
      }
      await dbTransaction.commit();
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('DEBT_UPDATE_FAIL');
    }
  }

  async deleteDebetor(id) {
    const debtor = await DebtorRepo.getDebtor(id);
    if(!debtor) throw new Exception('DEBT_NOT_EXIST');

    // begin transaction
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      const relatedTransactionId = debtor.debtRelId;
      // update debtor witn null value in RelId;
      debtor.debtRelId = null;
      let updatedDebtor = DebtorRepo.saveDebtor(debtor, dbTransaction);
      // delete related transaction
      let relatedTransaction = await RelatedTransactionRepo.getRelatedTransaction(relatedTransactionId);
      await RelatedTransactionRepo.deleteRelatedTransaction(relatedTransaction, dbTransaction);
      //delete debtor
      await DebtorRepo.deleteDebtor(debtor, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('DEBT_DELETE_FAIL');
    }
  }

  getDescription(debtorName, debtorCurrency) {
    return `Debtor ${debtorName} Transactions with ${debtorCurrency} Currency`;
  }
}

module.exports = DebtorBusiness;
