const express = require('express');
const Bank = require('./bank');

const router = express.Router();
const bank = new Bank();

router.get('/', function(req, res, next) {
  bank.getBanks().then( banks => {
    res.json(banks);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', function(req, res, next) {
  bank.getBank(req.params.id).then( bank => {
    res.json(bank);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  bank.addBank(req.body).then( result => {
    if(result.status) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  bank.updateBank(req.params.id, req.body).then( result => {
    if(result.status) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  bank.deleteBank(req.params.id).then( result => {
    if(result.status) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
