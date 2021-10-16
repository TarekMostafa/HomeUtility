import axios from 'axios';

class ExpenseDetailRequest {
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

//   static async updateExpenseType(expenseTypeId, expenseTypeName, typeCRDR) {
//     return await axios.put('/api/expenseTypes/'+expenseTypeId, {
//       expenseTypeName
//     });
//   }

  static async deleteExpenseDetail(expenseDetailId) {
    return await axios.delete('/api/expenseDetail/'+expenseDetailId);
  }

}

export default ExpenseDetailRequest;
