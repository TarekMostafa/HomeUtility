import axios from 'axios';

class RelatedTransctionRequest {
  static async getRelatedTransactions (limit, skip, type, description, id,
    includeDescription) {
    const response = await axios.get('/api/wealth/relatedTransactions', {
      params: {
        limit,
        skip,
        type,
        description,
        id,
        includeDescription
      }
    });
    return response.data;
  }
}

export default RelatedTransctionRequest;
