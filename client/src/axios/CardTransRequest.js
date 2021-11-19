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

  static async getCardTransaction(id) {
    const response = await axios.get('/api/cardTrans/'+id);
    return response.data;
  }

  static async addCardTransaction(cardId, transCurrency, transAmount, transDate, transDesc, billAmount) {
    return await axios.post('/api/cardTrans', {
      cardId, transCurrency, transAmount, transDate, transDesc, billAmount
    });
  }

  static async updateCardTransaction(cardTransId, transCurrency, transAmount, transDate, transDesc, billAmount) {
    return await axios.put('/api/cardTrans/'+cardTransId, {
      transCurrency, transAmount, transDate, transDesc, billAmount
    });
  }

  static async deleteCardTransaction(cardTransId) {
    return await axios.delete('/api/cardTrans/'+cardTransId);
  }
}

export default CardTransRequest;
