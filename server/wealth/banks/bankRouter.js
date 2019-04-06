const express = require('express');
const Bank = require('./bank');

const router = express.Router();
const bank = new Bank();

router.get('/', function(req, res, next) {
  bank.getBanks().then( banks => {
    res.json(banks);
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
