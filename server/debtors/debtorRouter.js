const express = require('express');
const DebtorBusiness = require('./debtorBusiness');

const router = express.Router();
const debtorBusiness = new DebtorBusiness();

router.get('/', function(req, res, next) {
    debtorBusiness.getDebtors(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', (req,res,next) => {
    debtorBusiness.getDebtor(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.post('/', function(req, res, next) {
    debtorBusiness.addDebtor(req.body).then( () => {
    res.messageCode = 'DEBT_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
    debtorBusiness.updateDebtor(req.params.id, req.body).then( () => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
    debtorBusiness.deleteDebetor(req.params.id).then( result => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
