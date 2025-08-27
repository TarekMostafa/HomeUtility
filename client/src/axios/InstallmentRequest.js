import axios from 'axios';

class InstallmentRequest {
  static async getInstallments(currency) {
    const response = await axios.get('/api/installments', {
        params: {
          currency
        }
      });
    return response.data;
  }

  static async getInstallment(id) {
    const response = await axios.get('/api/installments/'+id);
    return response.data;
  }

  static async addInstallment(instName, instCurrency, instStartDate, instEndDate, 
    instAmount, instNotes) {
    return await axios.post('/api/installments', {
      instName,
      instCurrency,
      instStartDate,
      instEndDate,
      instAmount,
      instNotes,
    });
  }

  static async updateInstallment(instId, instName, instCurrency, instStartDate, instEndDate, 
    instAmount, instStatus, instNotes) {
    return await axios.put('/api/installments/'+instId, {
      instName,
      instCurrency,
      instStartDate,
      instEndDate,
      instAmount,
      instStatus,
      instNotes,
    });
  }

  static async deleteInstallment(instId) {
    return await axios.delete('/api/installments/'+instId);
  }

}

export default InstallmentRequest;
