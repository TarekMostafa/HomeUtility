var https = require('https');

module.exports = function currencyConversion(fromCurrency, toCurrency, apiKey, cb) {
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  const query = fromCurrency + '_' + toCurrency;
  const url = 'https://free.currencyconverterapi.com/api/v6/convert?q='
            + query + '&compact=ultra&apiKey=' + apiKey;

  https.get(url, function(res){
      let body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          try {
            const jsonObj = JSON.parse(body);
            const val = jsonObj[query];
            if (val) {
              cb(null, val);
            } else {
              const err = new Error("Value not found for " + query);
              console.log(err);
              cb(err);
            }
          } catch(e) {
            console.log("Parse error: ", e);
            cb(e);
          }
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
        cb(e);
  });
}
