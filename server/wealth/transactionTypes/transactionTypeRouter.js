const express = require('express');
const TransactionTypeBusiness = require('./transactionTypeBusiness');
const AddTransactionTypeRequest = require('./Request/addTransactionTypeRequest');
const UpdateTransactionTypeRequest = require('./Request/updateTransactionTypeRequest');

const router = express.Router();
const transactionTypeBusiness = new TransactionTypeBusiness();

router.get('/', function(req, res, next) {
  transactionTypeBusiness.getTransactionTypes().then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  const transactionTypeRequest = new AddTransactionTypeRequest(req.body);
  transactionTypeBusiness.addTransactionType(transactionTypeRequest).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  const transactionTypeRequest = new UpdateTransactionTypeRequest(req.body);
  transactionTypeBusiness.updateTransactionType(req.params.id, transactionTypeRequest).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  transactionTypeBusiness.deleteTransactionType(req.params.id).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
