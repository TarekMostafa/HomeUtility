const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const BillTransactionRepo = require('./billTransactionRepo');
const BillRepo = require('./billRepo');
const Frequency = require('./frequency');
const Common = require('../utilities/common');
const Exception = require('../features/exception');
const AmountHelper = require('../helper/AmountHelper');
const TransactionRepo = require('../wealth/transactions/transactionRepo');
const ExpenseDetailRepo = require('../expenses/expenseDetail/expenseDetailRepo');

const Op = Sequelize.Op;

class BillTransaction {
  async getBillTransactions({limit, skip, billId, billDateFrom, billDateTo,
    postingDateFrom, postingDateTo, includeNotes, notes, amountType}) {

    limit = Common.getNumber(limit, 10);
    skip = Common.getNumber(skip, 0);
    // Construct Where Condition
    let whereQuery = {};
    // Bill Id
    if(billId) {
      whereQuery.billId = billId;
    }
    // Check Bill Date from and Posting Date To
    let _billdateFrom = Common.getDate(billDateFrom, '');
    let _billdateTo = Common.getDate(billDateTo, '');
    if(_billdateFrom !== '' && _billdateTo !== '') {
      whereQuery.transBillDate = { [Op.between] : [_billdateFrom, _billdateTo] };
    } else {
      if(_billdateFrom !== '') {
        whereQuery.transBillDate = { [Op.gte] : _billdateFrom };
      } else if(_billdateTo !== '') {
        whereQuery.transBillDate = { [Op.lte] : _billdateTo };
      }
    }
    // Check Posting Date from and Posting Date To
    let _dateFrom = Common.getDate(postingDateFrom, '');
    let _dateTo = Common.getDate(postingDateTo, '');
    if(_dateFrom !== '' && _dateTo !== '') {
      whereQuery.transPostingDate = { [Op.between] : [_dateFrom, _dateTo] };
    } else {
      if(_dateFrom !== '') {
        whereQuery.transPostingDate = { [Op.gte] : _dateFrom };
      } else if(_dateTo !== '') {
        whereQuery.transPostingDate = { [Op.lte] : _dateTo };
      }
    }
    // Check Notes
    if(notes) {
      if(includeNotes==='true') {
        whereQuery.transNotes = {
          [Op.substring] : notes.trim()
        }
      } else {
        whereQuery.transNotes = {
          [Op.notLike] : '%'+notes.trim()+'%'
        }
      }
    }
    // Check Type (Credit/Debit)
    if(amountType){
      whereQuery.transAmountType = amountType.trim();
    }
    let billTrans = await BillTransactionRepo.getBillTransactions(skip, limit, whereQuery);
    billTrans = billTrans.map(billTran => {
      return {
        transId: billTran.transId,
        transAmount: billTran.transAmount,
        transAmountFormatted: AmountHelper.formatAmount(billTran.transAmount,
          billTran.currency.currencyDecimalPlace),
        transBillDate: billTran.transBillDate,
        transNotes: billTran.transNotes,
        transOutOfFreq: billTran.transOutOfFreq,
        transAmountType: billTran.transAmountType,
        billId: billTran.billId,
        transPostingDate: billTran.transPostingDate,
        transCurrency: billTran.transCurrency,
        currencyDecimalPlace: billTran.currency.currencyDecimalPlace,
        billName: billTran.bill.billName,
        transSource: billTran.transSource,
        transExternalId: billTran.transExternalId,
        transReview: billTran.transReview,
      }
    });
    return billTrans;
  }

  async addNewBillTransaction({transAmount, transBillDate, transNotes,
    transOutOfFreq, transAmountType, billId, transPostingDate,
    billTransactionDetails
  }) {
    //Check bill Id
    const _bill = await BillRepo.getBill(billId);
    if(!_bill) {
      throw new Exception('BILL_NOT_EXIST');
    }
    //Bill Validation
    //Check bill start date against bill transaction bill date
    if(transBillDate < _bill.billStartDate) {
      throw new Exception('BILLTRANS_INVALID_BILLDATE', _bill.billStartDate);
    }
    //Check bill trans detail required with the trans details
    if(_bill.billIsTransDetailRequired && billTransactionDetails.length === 0) {
      throw new Exception('BILLTRANS_INVALID_DETAILS');
    }
    //Check bill date with Frequency incase it is in frequency
    if(!transOutOfFreq) {
      const dateRange = Frequency.getDateRange(_bill.billFrequency, transBillDate);
      let whereQuery = {};
      whereQuery.transBillDate = { [Op.between] : [dateRange.dateFrom, dateRange.dateTo] };
      whereQuery.transOutOfFreq = { [Op.not] : true};
      whereQuery.billId = _bill.billId;
      const tempTrans = await BillTransactionRepo.getBillTransactions(0, 999, whereQuery);
      if(tempTrans.length > 0) {
        throw new Exception('BILLTRANS_INVALID_FREQ', _bill.billFrequency);
      }
    }

    const billTrans = {
      transAmount,
      transBillDate,
      transNotes,
      transOutOfFreq,
      transAmountType,
      billId,
      transPostingDate,
      transCurrency: _bill.billCurrency,
      billTransactionDetails
    }

    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      // Check bill trans details
      if(billTrans.billTransactionDetails && Array.isArray(billTrans.billTransactionDetails)) {
        billTrans.billTransactionDetails = billTrans.billTransactionDetails.map( billTransDetail => {
          return {...billTransDetail, billItemId: billTransDetail.billItemId}
        });
      }
      await BillTransactionRepo.addBillTransaction(billTrans, dbTransaction);
      // update last bill paid date
      // when transaction is not out of frequency
      // transaction last bill paid date is less than transaction bill date 
      // or transaction last bill paid date is empty
      if(!billTrans.transOutOfFreq && 
         (_bill.billLastBillPaidDate < billTrans.transBillDate || !_bill.billLastBillPaidDate)) {
        _bill.billLastBillPaidDate = billTrans.transBillDate;
        await _bill.save({transaction: dbTransaction});
      }
      await dbTransaction.commit();
    } catch(err){
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('BILLTRANS_CREATE_FAIL');
    }
  }

  async getBillTransaction(id) {
    let billTrans = await BillTransactionRepo.getBillTransaction(id);
    const billTransactionDetails = billTrans.billTransactionDetails
      .map( detail => {
        return {
          detId: detail.detId,
          detAmount: detail.detAmount,
          detQuantity: detail.detQuantity,
          detAmountType: detail.detAmountType,
          billItemId: detail.billItemId,
          transId: detail.transId,
          billItemName: (detail.detItemType==='FREE'? 
            null:detail.billItem.billItemName),
          detItemText: detail.detItemText,
          detItemType: detail.detItemType,
        }
    });
    billTrans = {
      transId: billTrans.transId,
      transAmount: billTrans.transAmount,
      transBillDate: billTrans.transBillDate,
      transNotes: billTrans.transNotes,
      transOutOfFreq: billTrans.transOutOfFreq,
      transAmountType: billTrans.transAmountType,
      billId: billTrans.billId,
      transPostingDate: billTrans.transPostingDate,
      transCurrency: billTrans.transCurrency,
      currencyDecimalPlace: billTrans.currency.currencyDecimalPlace,
      billName: billTrans.bill.billName,
      billTransactionDetails: billTransactionDetails,
      transSource: billTrans.transSource,
      transExternalId: billTrans.transExternalId,
      transReview: billTrans.transReview,
    }
    return billTrans;
  }

  async editBillTransaction(id, {transAmount, transBillDate, transNotes,
    transOutOfFreq, transAmountType, transPostingDate, 
    billTransactionDetails
  }) {
     //Check bill Transaction
    const _billTrans = await BillTransactionRepo.getBillTransaction(id);
    if(!_billTrans) {
      throw new Exception('BILLTRANS_NOT_EXIST');
    }
    //Check bill Id
    const _bill = await BillRepo.getBill(_billTrans.billId);
    if(!_bill) {
      throw new Exception('BILL_NOT_EXIST');
    }
    //Bill Validation
    //Check bill start date against bill transaction bill date
    if(transBillDate < _bill.billStartDate) {
      throw new Exception('BILLTRANS_INVALID_BILLDATE', _bill.billStartDate);
    }
    //Check bill trans detail required with the trans details
    if(_bill.billIsTransDetailRequired && billTransactionDetails.length === 0) {
      throw new Exception('BILLTRANS_INVALID_DETAILS');
    }
    //Check bill date with Frequency incase it is in frequency
    if(!transOutOfFreq) {
      const dateRange = Frequency.getDateRange(_bill.billFrequency, transBillDate);
      let whereQuery = {};
      whereQuery.transBillDate = { [Op.between] : [dateRange.dateFrom, dateRange.dateTo] };
      whereQuery.transOutOfFreq = { [Op.not] : true};
      whereQuery.billId = _bill.billId;
      whereQuery.transId = { [Op.ne] : _billTrans.transId };
      const tempTrans = await BillTransactionRepo.getBillTransactions(0, 999, whereQuery);
      if(tempTrans.length > 0) {
        throw new Exception('BILLTRANS_INVALID_FREQ', _bill.billFrequency);
      }
    }
    //Set new Values
    _billTrans.transAmount = transAmount;
    _billTrans.transBillDate = transBillDate;
    _billTrans.transNotes = transNotes;
    _billTrans.transOutOfFreq = transOutOfFreq;
    _billTrans.transAmountType = transAmountType;
    _billTrans.transPostingDate = transPostingDate;
    _billTrans.transReview = 0;

    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      await _billTrans.save({transaction: dbTransaction});
      if(!_billTrans.transOutOfFreq && 
        (_bill.billLastBillPaidDate < _billTrans.transBillDate || !_bill.billLastBillPaidDate)) {
       _bill.billLastBillPaidDate = _billTrans.transBillDate;
       await _bill.save({transaction: dbTransaction});
      }

      let _transDetails = [..._billTrans.billTransactionDetails];
      // Loop through Trans Details
      for(let counter = 0; counter < _transDetails.length; counter++){
        let elem = _transDetails[counter];
        const findIndex = billTransactionDetails.findIndex( billTransDetail => 
          billTransDetail.detId === elem.detId    
        );

        // Detail is not found means to delete it from the db
        // Detail is found means to update it 
        if(findIndex < 0) {
          await _billTrans.billTransactionDetails[counter].destroy({transaction: dbTransaction});
        } else {
          const billTransDetail = billTransactionDetails[findIndex];
          _billTrans.billTransactionDetails[counter].detAmount = billTransDetail.detAmount;
          _billTrans.billTransactionDetails[counter].detQuantity = billTransDetail.detQuantity;
          _billTrans.billTransactionDetails[counter].detAmountType = billTransDetail.detAmountType;
          await _billTrans.billTransactionDetails[counter].save({transaction: dbTransaction});
        }
      }

      // filter in bill Trans and get item id = 0 
      let filterBillTransDetail = billTransactionDetails.filter( elem => elem.detId === 0);
      for(let counter = 0; counter < filterBillTransDetail.length; counter++){
        let elem =  filterBillTransDetail[counter];
        elem.billItemId = elem.billItemId;
        elem.transId = _billTrans.transId;
        await BillTransactionRepo.addBillTransactionDetail(elem, dbTransaction);
      }
      await dbTransaction.commit();
    } catch(err){
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('BILLTRANS_UPDATE_FAIL');
    }
  }

  async deleteBillTransaction(id)  {
    const _billTrans = await BillTransactionRepo.getBillTransaction(id);
    if(!_billTrans) {
      throw new Exception('BILLTRANS_NOT_EXIST');
    }

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      if(_billTrans.transSource === 'ACC' && _billTrans.transExternalId) {
        await TransactionRepo.updateBillTransactionId(_billTrans.transExternalId,
          null, dbTransaction
        );
      } else if (_billTrans.transSource === 'EXP' && _billTrans.transExternalId) {
        await ExpenseDetailRepo.updateBillTransactionId(_billTrans.transExternalId,
          null, dbTransaction
        );
      }
      await _billTrans.destroy({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch(err){
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('BILLTRANS_DELETE_FAIL');
    }
  }
}

module.exports = BillTransaction;
