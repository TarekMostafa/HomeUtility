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

    static async getLabelStatistics(label, currency, dateFrom, dateTo) {
        const response = await axios.get('/api/labels/labelstatistics', {
        params: {
            label, 
            currency,
            dateFrom,
            dateTo,
        }
        });
        return response.data;
    }
}

export default LabelRequest;