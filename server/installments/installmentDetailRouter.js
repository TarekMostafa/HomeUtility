const express = require('express');
const InstallmentDetailBusiness = require('./installmentDetailBusiness'); 

const router = express.Router();
const installmentDetailBusiness = new InstallmentDetailBusiness();

router.get('/', function(req, res, next) {
  installmentDetailBusiness.getInstallmentDetails(req.query, req.body).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', (req,res,next) => {
    installmentDetailBusiness.getInstallmentDetail(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.post('/', function(req, res, next) {
  installmentDetailBusiness.addInstallmentDetail(req.body).then( result => {
    res.messageCode = 'INST_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  installmentDetailBusiness.updateInstallmentDetail(req.params.id, req.body).then( result => {
    res.messageCode = 'INST_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  installmentDetailBusiness.deleteInstallmentDetail(req.params.id).then( result => {
    res.messageCode = 'INST_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
