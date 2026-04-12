const express = require('express');
const BillTransaction = require('./billTransaction');

const router = express.Router();
const billTrans = new BillTransaction();

router.get('/', function(req, res, next) {
  billTrans.getBillTransactions(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', function(req, res, next) {
  billTrans.getBillTransaction(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  billTrans.addNewBillTransaction(req.body).then( result => {
    res.messageCode = 'BILLTRANS_CREATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  billTrans.editBillTransaction(req.params.id, req.body).then( result => {
    res.messageCode = 'BILLTRANS_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  billTrans.deleteBillTransaction(req.params.id).then( result => {
    res.messageCode = 'BILLTRANS_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
