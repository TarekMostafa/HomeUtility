const express = require('express');
const AccountBusiness = require('./accountBusiness');

const router = express.Router();
const accountBusiness = new AccountBusiness();

router.get('/dropdown', function(req, res, next) {
  accountBusiness.getAccountsForDropDown().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/accountstatuses', function(req, res, next) {
  accountBusiness.getAccountStatuses().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/', function(req, res, next) {
  accountBusiness.getAccounts(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', function(req, res, next) {
  accountBusiness.getAccount(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  accountBusiness.addNewAccount(req.body).then( result => {
    res.messageCode = 'ACC_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  accountBusiness.editAccount(req.params.id, req.body).then( result => {
    res.messageCode = 'ACC_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  accountBusiness.deleteAccount(req.params.id).then( result => {
    res.messageCode = 'ACC_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
