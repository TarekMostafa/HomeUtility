const express = require('express');
const BillTransaction = require('./billTransaction');

const router = express.Router();
const billTrans = new BillTransaction();

router.get('/', function(req, res, next) {
  billTrans.getBillTransactions(req.query).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', function(req, res, next) {
  billTrans.getBillTransaction(req.params.id).then( result => {
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
  billTrans.addNewBillTransaction(req.body).then( result => {
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
  billTrans.editBillTransaction(req.params.id, req.body).then( result => {
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
  billTrans.deleteBillTransaction(req.params.id).then( result => {
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
