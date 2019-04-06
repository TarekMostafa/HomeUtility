const express = require('express');
const Account = require('./account');

const router = express.Router();
const account = new Account();

router.get('/dropdown', function(req, res, next) {
  account.getAccountsForDropDown().then( accounts => {
    res.json(accounts);
  }).catch( err => {
    next(err);
  })
});

router.get('/', function(req, res, next) {
  account.getAccounts(req.query).then( accounts => {
    res.json(accounts);
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
