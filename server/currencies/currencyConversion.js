const axios = require('axios');

module.exports = async (fromCurrency, toCurrency, apiKey) => {
  
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  const query = fromCurrency + '_' + toCurrency;
  const url = 'https://free.currconv.com/api/v7/convert?q='
            + query + '&compact=ultra&apiKey=' + apiKey;

  const response = await axios.get(url);
  return response.data[query];
}
