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

  static async addExpense(year, month, currency, openBalance) {
    return await axios.post('/api/expenses', {
        year, month, currency, openBalance
    });
  }

  static async updateExpense(expenseId, openBalance) {
    return await axios.put('/api/expenses/'+expenseId, {
      openBalance
    });
  }

//   static async deleteExpenseType(expenseTypeId) {
//     return await axios.delete('/api/expenseTypes/'+expenseTypeId);
//   }

}

export default ExpenseRequest;
