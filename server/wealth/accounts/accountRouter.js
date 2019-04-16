const express = require('express');
const Account = require('./account');

const router = express.Router();
const account = new Account();

router.get('/dropdown', function(req, res, next) {
  account.getAccountsForDropDown().then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.get('/accountstatuses', function(req, res, next) {
  account.getAccountStatuses().then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.get('/', function(req, res, next) {
  account.getAccounts(req.query).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
