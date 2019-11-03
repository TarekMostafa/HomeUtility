const express = require('express');
const Transaction = require('./transaction');
const SingleTransaction = require('./singleTransaction');
const InternalTransaction = require('./internalTransaction');

const router = express.Router();
const transaction = new Transaction();
const singleTransaction = new SingleTransaction();
const internalTransaction = new InternalTransaction();

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

router.get('/monthlystatistics', function(req, res, next) {
  transaction.getTotalTransactionsByType(req.query).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.post('/single', function(req, res, next) {
  singleTransaction.addSingleTransaction(req.body).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

router.post('/internal', function(req, res, next) {
  internalTransaction.addInternalTransaction(req.body).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

router.get('/single/:id', function(req, res, next) {
  transaction.getTransaction(req.params.id).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

router.put('/single/:id', function(req, res, next) {
  singleTransaction.editSingleTransaction(req.params.id, req.body).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

router.delete('/single/:id', function(req, res, next) {
  singleTransaction.deleteSingleTransaction(req.params.id).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
