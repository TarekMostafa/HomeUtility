import axios from 'axios';

class InstallmentDetailRequest {
  static async getInstallmentDetails(instId) {
    const response = await axios.get('/api/installmentDetail', {
        params: {
          instId
        }
      });
    return response.data;
  }

  static async getInstallmentDetail(id) {
    const response = await axios.get('/api/installmentDetail/'+id);
    return response.data;
  }

  static async addInstallmentDetail(instId, instDetDate, instDetAmount, instDetStatus, instDetCheckNumber, 
    instDetPaidDate, instDetNotes) {
    return await axios.post('/api/installmentDetail', {
      instId,
      instDetDate,
      instDetAmount,
      instDetStatus,
      instDetCheckNumber,
      instDetPaidDate,
      instDetNotes,
    });
  }

  static async updateInstallmentDetail(instDetId, instDetDate, instDetAmount, instDetStatus, 
    instDetCheckNumber, instDetPaidDate, instDetNotes) {
    return await axios.put('/api/installmentDetail/'+instDetId, {
      instDetDate,
      instDetAmount,
      instDetStatus,
      instDetCheckNumber,
      instDetPaidDate,
      instDetNotes,
    });
  }

  static async deleteInstallmentDetail(instId) {
    return await axios.delete('/api/installmentDetail/'+instId);
  }

}

export default InstallmentDetailRequest;
