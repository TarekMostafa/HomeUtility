import axios from 'axios';

class CardTransRequest {
  static async getCardsTransactions(cardId, cardInstId) {
    const response = await axios.get('/api/cardTrans', {
        params: {
            cardId, cardInstId
        }
      });
    return response.data;
  }

//   static async getCardInstallment(id) {
//     const response = await axios.get('/api/cardInst/'+id);
//     return response.data;
//   }

//   static async addCardInstallment(cardId, itemDesc, purchaseDate, noOfInst, price) {
//     return await axios.post('/api/cardInst', {
//         cardId, itemDesc, purchaseDate, noOfInst, price
//     });
//   }

//   static async updateCardInstallment(cardInstId, itemDesc, purchaseDate, noOfInst) {
//     return await axios.put('/api/cardInst/'+cardInstId, {
//       itemDesc, purchaseDate, noOfInst
//     });
//   }

//   static async deleteCardInstallment(cardInstId) {
//     return await axios.delete('/api/cardInst/'+cardInstId);
//   }
}

export default CardTransRequest;
