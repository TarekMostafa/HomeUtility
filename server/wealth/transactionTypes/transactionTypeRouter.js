const express = require('express');
const TransactionTypeBusiness = require('./transactionTypeBusiness');

const router = express.Router();
const transactionTypeBusiness = new TransactionTypeBusiness();

router.get('/', function(req, res, next) {
  transactionTypeBusiness.getTransactionTypes().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  transactionTypeBusiness.addTransactionType(req.body).then( result => {
    res.messageCode = 'TRANS_TYP_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  transactionTypeBusiness.updateTransactionType(req.params.id, req.body).then( result => {
    res.messageCode = 'TRANS_TYP_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  transactionTypeBusiness.deleteTransactionType(req.params.id).then( result => {
    res.messageCode = 'TRANS_TYP_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
