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

    static async getLabelStatistics(label, labelValues, currency, 
        dateFrom, dateTo, mode) {
        const response = await axios.get('/api/labels/labelstatistics', {
        params: {
            label,
            labelValues, 
            currency,
            dateFrom,
            dateTo,
            mode
        }
        });
        return response.data;
    }
}

export default LabelRequest;