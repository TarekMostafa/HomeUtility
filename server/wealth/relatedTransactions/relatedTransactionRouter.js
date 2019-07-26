const express = require('express');
const RelatedTransaction = require('./relatedTransaction');

const router = express.Router();
const relatedTransaction = new RelatedTransaction();

router.get('/', function(req, res, next) {
  relatedTransaction.getRelatedTransactions(req.query).then( result => {
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
