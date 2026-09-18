import axios from 'axios';

class LabelRequest {
    static async getLabels(labelNumber, labelCurrency, isGenerate) {
        const response = await axios.get('/api/labels', {
        params: {
            labelNumber,
            labelCurrency,
            isGenerate
        }
        });
        return response.data;
    }
}

export default LabelRequest;