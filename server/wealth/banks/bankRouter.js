const express = require('express');
const BankBusiness = require('./bankBusiness');

const router = express.Router();
const bankBusiness = new BankBusiness();

router.get('/', function(req, res, next) {
  bankBusiness.getBanks().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  bankBusiness.addBank(req.body).then( () => {
    res.messageCode = 'BANK_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  bankBusiness.updateBank(req.params.id, req.body).then( () => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  bankBusiness.deleteBank(req.params.id).then( () => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
