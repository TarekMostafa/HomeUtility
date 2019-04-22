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

router.post('/single', function(req, res, next) {
  transaction.addSingleTransaction(req.body).then( result => {
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
  transaction.getSingleTransaction(req.params.id).then( result => {
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
  transaction.editSingleTransaction(req.params.id, req.body).then( result => {
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
  transaction.deleteSingleTransaction(req.params.id).then( result => {
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
