const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const BillTransactionRepo = require('./billTransactionRepo');
const BillRepo = require('./billRepo');
const APIResponse = require('../utilities/apiResponse');
const Frequency = require('./frequency');

const Op = Sequelize.Op;

class BillTransaction {
  async getBillTransactions({limit, skip, billId, billDateFrom, billDateTo,
    postingDateFrom, postingDateTo, includeNotes, notes, amountType}) {

    if(!limit) limit = 10;
    if(!skip) skip = 0;
    // Construct Where Condition
    let whereQuery = {};
    // Bill Id
    if(billId) {
      whereQuery.billId = billId;
    }
    // Check Bill Date from and Posting Date To
    let _billdateFrom = Common.getDate(billDateFrom, '', false);
    let _billdateTo = Common.getDate(billDateTo, '', true);
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
    let _dateFrom = Common.getDate(postingDateFrom, '', false);
    let _dateTo = Common.getDate(postingDateTo, '', true);
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
    const billTrans = await BillTransactionRepo.getBillTransactions(skip, limit, whereQuery);
    return APIResponse.getAPIResponse(true, billTrans);
  }

  async addNewBillTransaction(billTrans) {
    //Check bill Id
    const _bill = await BillRepo.getBill(billTrans.billId);
    if(!_bill) {
      return APIResponse.getAPIResponse(false, null, '058');
    }
    //Bill Validation
    //Check bill start date against bill transaction bill date
    if(billTrans.transBillDate < _bill.billStartDate) {
      return APIResponse.getAPIResponse(false, null, '070', _bill.billStartDate);
    }
    //Check bill trans detail required with the trans details
    if(_bill.billIsTransDetailRequired && billTrans.billTransactionDetails.length === 0) {
      return APIResponse.getAPIResponse(false, null, '071');
    }
    //Check bill date with Frequency incase it is in frequency
    if(!billTrans.transOutOfFreq) {
      const dateRange = Frequency.getDateRange(_bill.billFrequency, billTrans.transBillDate);
      let whereQuery = {};
      whereQuery.transBillDate = { [Op.between] : [dateRange.dateFrom, dateRange.dateTo] };
      whereQuery.transOutOfFreq = { [Op.not] : true};
      whereQuery.billId = _bill.billId;
      const tempTrans = await BillTransactionRepo.getBillTransactions(0, 999, whereQuery);
      if(tempTrans.length > 0) {
        return APIResponse.getAPIResponse(false, null, '069', _bill.billFrequency);
      }
    }

    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      billTrans.transCurrency = _bill.billCurrency;
      // Check bill trans details
      if(billTrans.billTransactionDetails && Array.isArray(billTrans.billTransactionDetails)) {
        billTrans.billTransactionDetails = billTrans.billTransactionDetails.map( billTransDetail => {
          return {...billTransDetail, billItemId: billTransDetail.billItem.billItemId}
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
      return APIResponse.getAPIResponse(true, null, '063');
    } catch(err){
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '064');
    }
  }

  async getBillTransaction(id) {
    const billTrans = await BillTransactionRepo.getBillTransaction(id);
    return APIResponse.getAPIResponse(true, billTrans);
  }

  async editBillTransaction(id, billTrans) {
     //Check bill Transaction
    const _billTrans = await BillTransactionRepo.getBillTransaction(id);
    if(!_billTrans) {
      return APIResponse.getAPIResponse(false, null, '065');
    }
    //Check bill Id
    const _bill = await BillRepo.getBill(_billTrans.billId);
    if(!_bill) {
      return APIResponse.getAPIResponse(false, null, '058');
    }
    //Bill Validation
    //Check bill start date against bill transaction bill date
    if(billTrans.transBillDate < _bill.billStartDate) {
      return APIResponse.getAPIResponse(false, null, '070', _bill.billStartDate);
    }
    //Check bill trans detail required with the trans details
    if(_bill.billIsTransDetailRequired && billTrans.billTransactionDetails.length === 0) {
      return APIResponse.getAPIResponse(false, null, '071');
    }
    //Check bill date with Frequency incase it is in frequency
    if(!billTrans.transOutOfFreq) {
      const dateRange = Frequency.getDateRange(_bill.billFrequency, billTrans.transBillDate);
      let whereQuery = {};
      whereQuery.transBillDate = { [Op.between] : [dateRange.dateFrom, dateRange.dateTo] };
      whereQuery.transOutOfFreq = { [Op.not] : true};
      whereQuery.billId = _bill.billId;
      whereQuery.transId = { [Op.ne] : _billTrans.transId };
      const tempTrans = await BillTransactionRepo.getBillTransactions(0, 999, whereQuery);
      if(tempTrans.length > 0) {
        return APIResponse.getAPIResponse(false, null, '069', _bill.billFrequency);
      }
    }
    //Set new Values
    _billTrans.transAmount = billTrans.transAmount;
    _billTrans.transBillDate = billTrans.transBillDate;
    _billTrans.transNotes = billTrans.transNotes;
    _billTrans.transOutOfFreq = billTrans.transOutOfFreq;
    _billTrans.transAmountType = billTrans.transAmountType;
    _billTrans.transPostingDate = billTrans.transPostingDate;

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
        const findIndex = billTrans.billTransactionDetails.findIndex( billTransDetail => 
          billTransDetail.detId === elem.detId    
        );

        // Detail is not found means to delete it from the db
        // Detail is found means to update it 
        if(findIndex < 0) {
          await _billTrans.billTransactionDetails[counter].destroy({transaction: dbTransaction});
        } else {
          const billTransDetail = billTrans.billTransactionDetails[findIndex];
          _billTrans.billTransactionDetails[counter].detAmount = billTransDetail.detAmount;
          _billTrans.billTransactionDetails[counter].detQuantity = billTransDetail.detQuantity;
          _billTrans.billTransactionDetails[counter].detAmountType = billTransDetail.detAmountType;
          await _billTrans.billTransactionDetails[counter].save({transaction: dbTransaction});
        }
      }

      // filter in bill Trans and get item id = 0 
      let filterBillTransDetail = billTrans.billTransactionDetails.filter( elem => elem.detId === 0);
      for(let counter = 0; counter < filterBillTransDetail.length; counter++){
        let elem =  filterBillTransDetail[counter];
        elem.billItemId = elem.billItem.billItemId;
        elem.transId = _billTrans.transId;
        await BillTransactionRepo.addBillTransactionDetail(elem, dbTransaction);
      }
      await dbTransaction.commit();
      return APIResponse.getAPIResponse(true, null, '066');
    } catch(err){
      console.log(err);
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '067');
    }
  }

  async deleteBillTransaction(id)  {
    const _billTrans = await BillTransactionRepo.getBillTransaction(id);
    if(!_billTrans) {
      return APIResponse.getAPIResponse(false, null, '065');
    }
    await _billTrans.destroy();
    return APIResponse.getAPIResponse(true, null, '068');
  }
}

module.exports = BillTransaction;
