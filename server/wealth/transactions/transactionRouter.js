const express = require('express');
const TransactionBusiness = require('./transactionBusiness');
const SingleTransactionBusiness = require('./singleTransactionBusiness');
const InternalTransactionBusiness = require('./internalTransactionBusiness');

const router = express.Router();
const transactionBusiness = new TransactionBusiness();
const singleTransactionBusiness = new SingleTransactionBusiness();
const internalTransactionBusiness = new InternalTransactionBusiness();

router.get('/', function(req, res, next) {
  transactionBusiness.getTransactions(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/monthlystatistics', function(req, res, next) {
  transactionBusiness.getTotalTransactionsByType(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/single', function(req, res, next) {
  singleTransactionBusiness.addSingleTransaction(req.body).then( result => {
    res.messageCode = 'TRANS_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.post('/internal', function(req, res, next) {
  internalTransactionBusiness.addInternalTransaction(req.body).then( result => {
    res.messageCode = 'TRANS_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.get('/single/:id', function(req, res, next) {
  transactionBusiness.getTransaction(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.put('/single/:id', function(req, res, next) {
  singleTransactionBusiness.editSingleTransaction(req.params.id, req.body).then( result => {
    res.messageCode = 'TRANS_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.delete('/single/:id', function(req, res, next) {
  singleTransactionBusiness.deleteSingleTransaction(req.params.id).then( result => {
    res.messageCode = 'TRANS_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
