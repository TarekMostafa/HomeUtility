const express = require('express');
const Deposit = require('./deposit');

const router = express.Router();
const deposit = new Deposit();

router.get('/', function(req, res, next) {
  deposit.getDeposits(req.query).then( result => {
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
  deposit.getDeposit(req.params.id).then( result => {
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
  deposit.addNewDeposit(req.body).then( result => {
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
