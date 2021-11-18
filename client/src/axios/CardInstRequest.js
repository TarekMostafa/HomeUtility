import axios from 'axios';

class CardInstRequest {
  static async getCardsInstallments(cardId) {
    const response = await axios.get('/api/cardInst', {
        params: {
            cardId
        }
      });
    return response.data;
  }

  static async getCardInstallment(id) {
    const response = await axios.get('/api/cardInst/'+id);
    return response.data;
  }

  static async addCardInstallment(cardId, itemDesc, purchaseDate, noOfInst, price) {
    return await axios.post('/api/cardInst', {
        cardId, itemDesc, purchaseDate, noOfInst, price
    });
  }

  static async updateCardInstallment(cardInstId, itemDesc, purchaseDate, noOfInst) {
    return await axios.put('/api/cardInst/'+cardInstId, {
      itemDesc, purchaseDate, noOfInst
    });
  }

  static async deleteCardInstallment(cardInstId) {
    return await axios.delete('/api/cardInst/'+cardInstId);
  }

  static async postCardInstallment(cardInstId, transAmt, transDate, transDesc) {
    return await axios.post('/api/cardInst/postInstallment/'+cardInstId, {
      transAmt, transDate, transDesc
    });
  }

  static async terminateCardInstallment(cardInstId) {
    return await axios.post('/api/cardInst/terminateInstallment/'+cardInstId, {
    });
  }
}

export default CardInstRequest;
