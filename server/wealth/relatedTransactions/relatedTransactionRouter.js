const express = require('express');
const RelatedTransactionBusiness = require('./relatedTransactionBusiness');

const router = express.Router();
const relatedTransactionBusiness = new RelatedTransactionBusiness();

router.get('/', function(req, res, next) {
  relatedTransactionBusiness.getRelatedTransactions(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/details', function(req, res, next) {
  relatedTransactionBusiness.getRelatedTransactionsDetails(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
