const express = require('express');
const Transaction = require('./transaction');

const router = express.Router();
const transaction = new Transaction();

router.get('/', function(req, res, next) {
  transaction.getTransactions(req.query).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
