const express = require('express');
const DepositBusiness = require('./depositBusiness');
const Exception = require('../../features/exception');

const router = express.Router();
const depositBusiness = new DepositBusiness();

router.get('/', function(req, res, next) {
  depositBusiness.getDeposits(req.query, req.body).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', function(req, res, next) {
  depositBusiness.getDeposit(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  depositBusiness.addNewDeposit(req.body).then( result => {
    res.messageCode = 'DEP_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  depositBusiness.deleteDeposit(req.params.id).then( result => {
    res.messageCode = 'DEP_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.post('/interest/:id', function(req, res, next) {
  depositBusiness.addDepositInterest(req.params.id, req.body).then( result => {
    res.messageCode = 'DEP_INT_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.post('/release/:id', function(req, res, next) {
  depositBusiness.releaseDeposit(req.params.id, req.body).then( result => {
    res.messageCode = 'DEP_REL_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
