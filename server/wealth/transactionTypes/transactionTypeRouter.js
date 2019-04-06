const express = require('express');
const TransactionType = require('./transactionType');

const router = express.Router();
const transactionType = new TransactionType();

router.get('/dropdown', function(req, res, next) {
  transactionType.getTransactionTypesForDropDown().then( transactionTypes => {
    res.json(transactionTypes);
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
