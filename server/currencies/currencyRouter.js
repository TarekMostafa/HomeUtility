const express = require('express');
const Currency = require('./currency');

const router = express.Router();
const currency = new Currency();

router.get('/', function(req, res, next) {
  currency.getCurrencies(req.query).then( currencies => {
    res.json(currencies);
  }).catch( err => {
    next(err);
  })
});

router.post('/activate', function(req, res, next){
  currency.activateCurrency(req.body).then( () => {
    res.sendStatus(200);
  }).catch( err => {
    next(err);
  })
})

router.post('/deactivate', function(req, res, next){
  currency.deactivateCurrency(req.body).then( () => {
    res.sendStatus(200);
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
