import axios from 'axios';

class ExpenseDetailRequest {
  static async getExpensesDetails(limit, skip, description, includeDescription, 
    expDateFrom, expDateTo, expIsAdjusment, expTypes,
    label1, label2, label3, label4, label5) {
    const response = await axios.get('/api/expenseDetail/search', {
      params: {
        limit, skip, description, includeDescription, 
        expDateFrom, expDateTo, expIsAdjusment, expTypes,
        label1, label2, label3, label4, label5
      }
    });
    return response.data;
  }

  static async getExpenseDetails(expenseId) {
    const response = await axios.get('/api/expenseDetail', {
        params: {
            expenseId
        }
      });
    return response.data;
  }

  static async addExpenseDetail(expenseId, expenseDay, expenseAmount, expenseDescription, 
    expenseTypeId, expenseAdjusment) {
    return await axios.post('/api/expenseDetail', {
        expenseId, expenseDay, expenseAmount, expenseDescription, expenseTypeId, expenseAdjusment
    });
  }

  static async updateExpenseDetail(expenseDetailId, expenseTypeId, expenseDescription) {
    return await axios.put('/api/expenseDetail/'+expenseDetailId, {
      expenseTypeId, expenseDescription
    });
  }

  static async deleteExpenseDetail(expenseDetailId) {
    return await axios.delete('/api/expenseDetail/'+expenseDetailId);
  }

  static async updateExpenseLabels(expenseDetailId, expenseLabel1, expenseLabel2, expenseLabel3,
    expenseLabel4, expenseLabel5) {
      return await axios.put('/api/expenseDetail/updateLabels/'+expenseDetailId, {
        expenseLabel1, expenseLabel2, expenseLabel3, expenseLabel4, expenseLabel5
      })
  }

}

export default ExpenseDetailRequest;
