const express = require('express');
const Transaction = require('./transaction');

const router = express.Router();
const transaction = new Transaction();

router.get('/', function(req, res, next) {
  transaction.getTransactions(req.query).then( transactions => {
    res.json(transactions);
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
