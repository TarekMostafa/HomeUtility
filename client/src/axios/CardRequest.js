import axios from 'axios';

class CardRequest {
  static async getCards(bank, currency, status) {
    const response = await axios.get('/api/cards', {
        params: {
          bank, currency, status
        }
      });
    return response.data;
  }

  static async getCard(id) {
    const response = await axios.get('/api/cards/'+id);
    return response.data;
  }

  static async addCard(cardNumber,cardLimit,cardBank, cardCurrency, cardStartDate, 
    cardExpiryDate) {
    return await axios.post('/api/cards', {
        cardNumber,cardLimit,cardBank, cardCurrency, cardStartDate, cardExpiryDate
    });
  }

  static async updateCard(cardId, cardLimit, cardStatus, cardStartDate, cardExpiryDate) {
    return await axios.put('/api/cards/'+cardId, {
        cardLimit, cardStatus, cardStartDate, cardExpiryDate
    });
  }

  static async deleteCard(cardId) {
    return await axios.delete('/api/cards/'+cardId);
  }

}

export default CardRequest;
