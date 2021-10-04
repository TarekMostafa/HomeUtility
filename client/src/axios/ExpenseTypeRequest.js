import axios from 'axios';

class ExpenseTypeRequest {
  static async getExpenseTypes() {
    const response = await axios.get('/api/expenseTypes');
    return response.data;
  }

  static async addExpenseType(expenseTypeName) {
    return await axios.post('/api/expenseTypes', {
      expenseTypeName
    });
  }

  static async updateExpenseType(expenseTypeId, expenseTypeName, typeCRDR) {
    return await axios.put('/api/expenseTypes/'+expenseTypeId, {
      expenseTypeName
    });
  }

  static async deleteExpenseType(expenseTypeId) {
    return await axios.delete('/api/expenseTypes/'+expenseTypeId);
  }

}

export default ExpenseTypeRequest;
