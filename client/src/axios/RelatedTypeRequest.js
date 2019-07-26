import axios from 'axios';

class RelatedTypeRequest {
  static async getRelatedTypes () {
    const response = await axios.get('/api/wealth/relatedTypes');
    return response.data;
  }
}

export default RelatedTypeRequest;
