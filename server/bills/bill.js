const sequelize = require('../db/dbConnection').getSequelize();
const BillRepo = require('./billRepo');
const BillTransactionRepo = require('./billTransactionRepo');
const Exception = require('../features/exception');
const AmountHelper = require('../helper/AmountHelper');

class Bill {
  async getBillsForDropDown() {
    let bills = await BillRepo.getSimpleBills();
    bills = bills.map( bill => {
      return {
        billId: bill.billId,
        billName: bill.billName,
        billStatus: bill.billStatus,
        billCurrency: bill.billCurrency,
        billFrequency: bill.billFrequency,
        billDefaultAmount: bill.billDefaultAmount,
        currencyDecimalPlace: bill.currency.currencyDecimalPlace,
      }
    });
    return bills;
  }

  async getBills({status}) {
    // Construct Where Condition
    let whereQuery = {};
    // Status
    if(status) {
      whereQuery.billStatus = status;
    }
    let bills = await BillRepo.getBills(whereQuery);
    bills = bills.map( bill => {
      return {
        billId: bill.billId,
        billName: bill.billName,
        billStatus: bill.billStatus,
        billCurrency: bill.billCurrency,
        billFrequency: bill.billFrequency,
        billDefaultAmount: bill.billDefaultAmount,
        billDefaultAmountFormatted: AmountHelper.formatAmount(bill.billDefaultAmount,
          bill.currency.currencyDecimalPlace),
        billStartDate: bill.billStartDate,
        billLastBillPaidDate: bill.billLastBillPaidDate,
        billIsTransDetailRequired: bill.billIsTransDetailRequired,
        currencyDecimalPlace: bill.currency.currencyDecimalPlace
      }
    });
    return bills;
  }

  async getBillStatuses() {
    const billStatuses = ['ACTIVE', 'CLOSED'];
    return billStatuses;
  }

  async getBillFrequencies() {
    const billFrequencies = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'BIMONTHLY', 
      'QUARTERLY', 'TRIANNUALLY', 'SEMIANNUALLY', 'ANNUALLY'];
    return billFrequencies;
  }

  async getCountOfBillItemUsed(billItemId) {
    // Construct Where Condition
    let whereQuery = {};
    whereQuery.billItemId = billItemId
    const billTransDetails = await BillTransactionRepo.getBillTransactionDetails(whereQuery);
    return billTransDetails.length;
  }

  async addNewBill({billName, billFrequency, billCurrency, billStartDate, 
    billDefaultAmount, billIsTransDetailRequired, items}) {
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      let bill = {
        billFrequency,
        billName,
        billStartDate,
        billStatus: 'ACTIVE',
        billCurrency,
        billDefaultAmount,
        billIsTransDetailRequired,
        billItems: [],
      }
      // Check bill Items
      if(items && Array.isArray(items)) {
        items.forEach(item => {
          bill.billItems.push({
            billItemName: item
          })
        });
      }
      await BillRepo.addBill(bill, dbTransaction);
      await dbTransaction.commit();
    } catch(err){
      await dbTransaction.rollback();
      throw new Exception('BILL_CREATE_FAIL');
    }
  }

  async getBill(id) {
    let bill = await BillRepo.getBill(id);
    const billItems = bill.billItems.map( billItem => {
      return {
        billItemId: billItem.billItemId,
        billItemName: billItem.billItemName,
      }
    });
    bill = {
      billId: bill.billId,
      billName: bill.billName,
      billStatus: bill.billStatus,
      billCurrency: bill.billCurrency,
      billFrequency: bill.billFrequency,
      billDefaultAmount: bill.billDefaultAmount,
      billStartDate: bill.billStartDate,
      billLastBillPaidDate: bill.billLastBillPaidDate,
      billIsTransDetailRequired: bill.billIsTransDetailRequired,
      currencyDecimalPlace: bill.currency.currencyDecimalPlace,
      billItems: billItems
    }
    return bill;
  }

  async editBill(id, {billName, billFrequency, billStartDate, 
    billDefaultAmount, billStatus, billIsTransDetailRequired, billItems
  }) {
    const _bill = await BillRepo.getBill(id);
    if(!_bill) {
      throw new Exception('BILL_NOT_EXIST');
    }
    _bill.billName = billName;
    _bill.billFrequency = billFrequency;
    _bill.billStartDate = billStartDate;
    _bill.billDefaultAmount = billDefaultAmount;
    _bill.billStatus = billStatus;
    _bill.billIsTransDetailRequired = billIsTransDetailRequired;

    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      
      let _billItems = [..._bill.billItems];
      // Loop through Bill Items
      for(let counter = 0; counter < _billItems.length; counter++){
        let elem = _billItems[counter];
        const findIndex = billItems.findIndex( billItem => 
          billItem.billItemId === elem.billItemId
        );

        // Item is not found means to delete it from the db
        // Item is found means to update it 
        if(findIndex < 0) {
          await _bill.billItems[counter].destroy({transaction: dbTransaction});
        } else {
          const _billItems = billItems[findIndex];
          _bill.billItems[counter].billItemName = _billItems.billItemName;
          await _bill.billItems[counter].save({transaction: dbTransaction});
        }
      }

      // filter in Bill Items and get billItemId = 0 
      let filterBillItems = billItems.filter( elem => elem.billItemId === 0);
      for(let counter = 0; counter < filterBillItems.length; counter++){
        let elem =  filterBillItems[counter];
        elem.billId = _bill.billId;
        await BillRepo.addBillItem(elem, dbTransaction);
      }
      await _bill.save({transaction: dbTransaction});
      await dbTransaction.commit();
    }catch(err){
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('BILL_UPDATE_FAIL');
    }
  }

  async deleteBill(id)  {
    const _bill = await BillRepo.getBill(id);
    if(_bill === null) {
      throw new Exception('BILL_NOT_EXIST');
    }
    await _bill.destroy();
  }
}

module.exports = Bill;
