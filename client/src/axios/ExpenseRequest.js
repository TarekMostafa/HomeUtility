import axios from 'axios';

class ExpenseRequest {
  static async getExpenses(year) {
    const response = await axios.get('/api/expenses', {
        params: {
            year
        }
      });
    return response.data;
  }

  static async getExpense(id) {
    const response = await axios.get('/api/expenses/'+id);
    return response.data;
  }

  static async addExpense(year, month, currency, openBalance, allowedDebitTransTypeIds, 
    extractedDebitTransTypeIds) {
    return await axios.post('/api/expenses', {
        year, month, currency, openBalance, allowedDebitTransTypeIds, extractedDebitTransTypeIds
    });
  }

  static async updateExpense(expenseId, openBalance, allowedDebitTransTypeIds, 
    expenseStatus) {
    return await axios.put('/api/expenses/'+expenseId, {
      openBalance, allowedDebitTransTypeIds, expenseStatus
    });
  }

  static async updateTotalAccountDebit(expenseId, diffAmount) {
    return await axios.put('/api/expenses/updateTotalAccountDebit/'+expenseId, {
      diffAmount
    });
  }

//   static async deleteExpenseType(expenseTypeId) {
//     return await axios.delete('/api/expenseTypes/'+expenseTypeId);
//   }

}

export default ExpenseRequest;
