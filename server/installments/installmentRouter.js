const express = require('express');
const InstallmentBusiness = require('./installmentBusiness'); 

const router = express.Router();
const installmentBusiness = new InstallmentBusiness();

router.get('/', function(req, res, next) {
  installmentBusiness.getInstallments(req.query, req.body).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', (req,res,next) => {
    installmentBusiness.getInstallment(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.post('/', function(req, res, next) {
  installmentBusiness.addInstallment(req.body).then( result => {
    res.messageCode = 'INST_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  installmentBusiness.updateInstallment(req.params.id, req.body).then( result => {
    res.messageCode = 'INST_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  installmentBusiness.deleteInstallment(req.params.id).then( result => {
    res.messageCode = 'INST_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
