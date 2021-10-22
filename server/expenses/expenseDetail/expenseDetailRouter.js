const express = require('express');
const ExpenseDetailBusiness = require('./expenseDetailBusiness');

const router = express.Router();
const expenseDetailBusiness = new ExpenseDetailBusiness();

router.get('/', function(req, res, next) {
    expenseDetailBusiness.getExpenseDetails(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  console.log(`req body ${JSON.stringify(req.body)}`)
    expenseDetailBusiness.addExpenseDetail(req.body).then( () => {
    res.messageCode = 'EXP_DET_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  expenseDetailBusiness.updateExpenseDetail(req.params.id, req.body).then( () => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
    expenseDetailBusiness.deleteExpenseDetail(req.params.id).then( result => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
