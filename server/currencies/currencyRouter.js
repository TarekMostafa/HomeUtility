const express = require('express');
const Currency = require('./currency');

const router = express.Router();
const currency = new Currency();

router.get('/', function(req, res, next) {
  currency.getCurrencies(req.query).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next){
  currency.addCurrency(req.body).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

router.get('/currencyInfo', function(req, res, next) {
  currency.getCurrencyInfoFromThirdParty(req.query).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.put('/activate', function(req, res, next){
  currency.activateCurrency(req.body).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

router.put('/deactivate', function(req, res, next){
  currency.deactivateCurrency(req.body).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

router.put('/updaterates', function(req, res, next){
  currency.updateRates().then( () => {
    res.status(200).send('Rates have been successfully updated');
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
