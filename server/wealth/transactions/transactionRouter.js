const express = require('express');
const TransactionBusiness = require('./transactionBusiness');
const SingleTransactionBusiness = require('./singleTransactionBusiness');
const InternalTransactionBusiness = require('./internalTransactionBusiness');
const DebtTransactionBusiness = require('./debtTransactionBusiness');

const router = express.Router();
const transactionBusiness = new TransactionBusiness();
const singleTransactionBusiness = new SingleTransactionBusiness();
const internalTransactionBusiness = new InternalTransactionBusiness();
const debtTransactionBusiness = new DebtTransactionBusiness();

router.get('/', function(req, res, next) {
  transactionBusiness.getTransactions(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/monthlystatistics', function(req, res, next) {
  transactionBusiness.getTotalTransactionsByType(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/single', function(req, res, next) {
  singleTransactionBusiness.addSingleTransaction(req.body).then( result => {
    res.messageCode = 'TRANS_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.post('/internal', function(req, res, next) {
  internalTransactionBusiness.addInternalTransaction(req.body).then( result => {
    res.messageCode = 'TRANS_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.get('/internal/getDefaults', (req, res, next) => {
  internalTransactionBusiness.getDefaultData().then(result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/single/:id', function(req, res, next) {
  transactionBusiness.getTransaction(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.put('/single/:id', function(req, res, next) {
  singleTransactionBusiness.editSingleTransaction(req.params.id, req.body).then( result => {
    res.messageCode = 'TRANS_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.delete('/single/:id', function(req, res, next) {
  singleTransactionBusiness.deleteSingleTransaction(req.params.id).then( result => {
    res.messageCode = 'TRANS_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.post('/debt', (req, res, next) => {
  debtTransactionBusiness.addDebtTransaction(req.body).then( result => {
    res.messageCode = 'TRANS_DBT_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/debt/:id', (req, res, next) => {
  debtTransactionBusiness.updateDebtTransaction(req.params.id, req.body).then( result => {
    res.messageCode = 'TRANS_DBT_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/debt/:id', (req, res, next) => {
  debtTransactionBusiness.deleteDebtTransaction(req.params.id).then( result => {
    res.messageCode = 'TRANS_DBT_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.post('/debt/converttodebt/:id', (req, res, next) => {
  debtTransactionBusiness.convertSingleTransactionToDebtTransaction(req.params.id, req.body).then( result => {
    res.messageCode = 'TRANS_DBT_CONVERT_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.post('/debt/linktodebtor/:id', (req, res, next) => {
  debtTransactionBusiness.linkSingleTransactionToDebtor(req.params.id, req.body).then( result => {
    res.messageCode = 'TRANS_DBT_LINK_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
