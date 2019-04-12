const express = require('express');
const TransactionType = require('./transactionType');

const router = express.Router();
const transactionType = new TransactionType();

router.get('/', function(req, res, next) {
  transactionType.getTransactionTypes().then( transactionTypes => {
    res.json(transactionTypes);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', function(req, res, next) {
  transactionType.getTransactionType(req.params.id).then( transactionType => {
    res.json(transactionType);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  transactionType.addTransactionType(req.body).then( result => {
    if(result.status) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  transactionType.updateTransactionType(req.params.id, req.body).then( result => {
    if(result.status) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  transactionType.deleteTransactionType(req.params.id).then( result => {
    if(result.status) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
