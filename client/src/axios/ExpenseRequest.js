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

  static async addExpense(year, month, currency, openBalance) {
    return await axios.post('/api/expenses', {
        year, month, currency, openBalance
    });
  }

//   static async updateExpenseType(expenseTypeId, expenseTypeName, typeCRDR) {
//     return await axios.put('/api/expenseTypes/'+expenseTypeId, {
//       expenseTypeName
//     });
//   }

//   static async deleteExpenseType(expenseTypeId) {
//     return await axios.delete('/api/expenseTypes/'+expenseTypeId);
//   }

}

export default ExpenseRequest;
