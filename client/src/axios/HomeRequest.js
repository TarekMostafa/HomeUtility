import axios from 'axios';

class HomeRequest {
    static async getTotals() {
        const response = await axios.get('/api/home');
        return response.data;
    }
}

export default HomeRequest;