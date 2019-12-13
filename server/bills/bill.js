const sequelize = require('../db/dbConnection').getSequelize();
const BillRepo = require('./billRepo');
const BillTransactionRepo = require('./billTransactionRepo');
const APIResponse = require('../utilities/apiResponse');

class Bill {
  async getBillsForDropDown() {
    const bills = await BillRepo.getSimpleBills();
    return APIResponse.getAPIResponse(true, bills);
  }

  async getBills({status}) {
    // Construct Where Condition
    let whereQuery = {};
    // Status
    if(status) {
      whereQuery.billStatus = status;
    }
    const bills = await BillRepo.getBills(whereQuery);
    return APIResponse.getAPIResponse(true, bills);
  }

  async getBillStatuses() {
    const billStatuses = ['ACTIVE', 'CLOSED'];
    return APIResponse.getAPIResponse(true, billStatuses);
  }

  async getBillFrequencies() {
    const billFrequencies = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'BIMONTHLY', 
      'QUARTERLY', 'TRIANNUALLY', 'SEMIANNUALLY', 'ANNUALLY'];
    return APIResponse.getAPIResponse(true, billFrequencies);
  }

  async getCountOfBillItemUsed(billItemId) {
    // Construct Where Condition
    let whereQuery = {};
    whereQuery.billItemId = billItemId
    const billTransDetails = await BillTransactionRepo.getBillTransactionDetails(whereQuery);
    return APIResponse.getAPIResponse(true, billTransDetails.length);
  }

  async addNewBill(bill) {
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      bill.billStatus = 'ACTIVE';
      // Check bill Items
      if(bill.items && Array.isArray(bill.items)) {
        bill.billItems = [];
        bill.items.forEach(item => {
          bill.billItems.push({
            billItemName: item
          })
        });
      }
      await BillRepo.addBill(bill, dbTransaction);
      await dbTransaction.commit();
      return APIResponse.getAPIResponse(true, null, '057');
    } catch(err){
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '061');
    }
  }

  async getBill(id) {
    const bill = await BillRepo.getBill(id);
    return APIResponse.getAPIResponse(true, bill);
  }

  async editBill(id, bill) {
    const _bill = await BillRepo.getBill(id);
    if(!_bill) {
      return APIResponse.getAPIResponse(false, null, '058');
    }
    _bill.billName = bill.billName;
    _bill.billFrequency = bill.billFrequency;
    _bill.billStartDate = bill.billStartDate;
    _bill.billDefaultAmount = bill.billDefaultAmount;
    _bill.billStatus = bill.billStatus;
    _bill.billIsTransDetailRequired = bill.billIsTransDetailRequired;

    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      
      let _billItems = [..._bill.billItems];
      // Loop through Bill Items
      console.log(bill.billItems, _billItems);
      for(let counter = 0; counter < _billItems.length; counter++){
        let elem = _billItems[counter];
        const findIndex = bill.billItems.findIndex( billItem => 
          billItem.billItemId === elem.billItemId
        );

        // Item is not found means to delete it from the db
        // Item is found means to update it 
        if(findIndex < 0) {
          await _bill.billItems[counter].destroy({transaction: dbTransaction});
        } else {
          const billItems = bill.billItems[findIndex];
          _bill.billItems[counter].billItemName = billItems.billItemName;
          await _bill.billItems[counter].save({transaction: dbTransaction});
        }
      }

      // filter in Bill Items and get billItemId = 0 
      let filterBillItems = bill.billItems.filter( elem => elem.billItemId === 0);
      for(let counter = 0; counter < filterBillItems.length; counter++){
        let elem =  filterBillItems[counter];
        elem.billId = _bill.billId;
        await BillRepo.addBillItem(elem, dbTransaction);
      }
      await _bill.save({transaction: dbTransaction});
      await dbTransaction.commit();
      return APIResponse.getAPIResponse(true, null, '059');
    }catch(err){
      console.log(err);
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '062');
    }
  }

  async deleteBill(id)  {
    const _bill = await BillRepo.getBill(id);
    if(_bill === null) {
      return APIResponse.getAPIResponse(false, null, '058');
    }
    await _bill.destroy();
    return APIResponse.getAPIResponse(true, null, '060');
  }
}

module.exports = Bill;
