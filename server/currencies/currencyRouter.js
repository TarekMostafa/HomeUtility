const express = require('express');
const CurrencyBusiness = require('./currencyBusiness');

const router = express.Router();
const currencyBusiness = new CurrencyBusiness();

router.get('/', function(req, res, next) {
  currencyBusiness.getCurrencies(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next){
  currencyBusiness.addCurrency(req.body).then( result => {
    res.messageCode = 'CURR_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.put('/', function(req, res, next){
  currencyBusiness.updateCurrency(req.body).then( result => {
    res.messageCode = 'CURR_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.get('/currencyInfo', function(req, res, next) {
  currencyBusiness.getCurrencyInfoFromThirdParty(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.put('/activate', function(req, res, next){
  currencyBusiness.activateCurrency(req.body).then( result => {
    res.messageCode = 'CURR_ACT_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.put('/deactivate', function(req, res, next){
  currencyBusiness.deactivateCurrency(req.body).then( result => {
    res.messageCode = 'CURR_DEACT_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.put('/updaterates', function(req, res, next){
  currencyBusiness.updateRates(req.body).then( () => {
    //res.status(200).send('Rates have been successfully updated');
    res.messageCode = 'RATES_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
