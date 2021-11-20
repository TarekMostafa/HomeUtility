import axios from 'axios';

class CardTransRequest {
  static async getCardsTransactions(cardId, cardInstId, cardPayment, cardIsPaid, skip, limit) {
    const response = await axios.get('/api/cardTrans', {
        params: {
            cardId, cardInstId, cardPayment, cardIsPaid, skip, limit
        }
      });
    return response.data;
  }

  static async getCardTransaction(id) {
    const response = await axios.get('/api/cardTrans/'+id);
    return response.data;
  }

  static async addCardTransaction(cardId, transCurrency, transAmount, transDate, 
    transDesc, billAmount, instId) {
    return await axios.post('/api/cardTrans', {
      cardId, transCurrency, transAmount, transDate, transDesc, billAmount, instId
    });
  }

  static async updateCardTransaction(cardTransId, transCurrency, transAmount, transDate, 
    transDesc, billAmount, instId) {
    return await axios.put('/api/cardTrans/'+cardTransId, {
      transCurrency, transAmount, transDate, transDesc, billAmount, instId
    });
  }

  static async deleteCardTransaction(cardTransId) {
    return await axios.delete('/api/cardTrans/'+cardTransId);
  }

  static async payCardTransactions(cardTransIds, accountId, transactionTypeId, postingDate) {
    return await axios.post('/api/cardTrans/payCardTransactions', {
      cardTransIds, accountId, transactionTypeId, postingDate
    });
  }
}

export default CardTransRequest;
