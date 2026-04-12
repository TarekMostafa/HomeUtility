const express = require('express');
const Bill = require('./bill');

const router = express.Router();
const bill = new Bill();

router.get('/dropdown', function(req, res, next) {
  bill.getBillsForDropDown().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/billstatuses', function(req, res, next) {
  bill.getBillStatuses().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/billfrequencies', function(req, res, next) {
  bill.getBillFrequencies().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/getCountOfBillItemUsed/:id', function(req, res, next) {
  bill.getCountOfBillItemUsed(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/', function(req, res, next) {
  bill.getBills(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', function(req, res, next) {
  bill.getBill(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  bill.addNewBill(req.body).then( result => {
    res.messageCode = 'BILL_CREATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  bill.editBill(req.params.id, req.body).then( result => {
    res.messageCode = 'BILL_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  bill.deleteBill(req.params.id).then( result => {
    res.messageCode = 'BILL_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
