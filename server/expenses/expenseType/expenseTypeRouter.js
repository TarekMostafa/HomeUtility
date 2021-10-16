const express = require('express');
const ExpenseTypeBusiness = require('./expenseTypeBusiness');

const router = express.Router();
const expenseTypeBusiness = new ExpenseTypeBusiness();

router.get('/', function(req, res, next) {
  expenseTypeBusiness.getExpenseTypes().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
  expenseTypeBusiness.addExpenseType(req.body).then( () => {
    res.messageCode = 'EXP_TYP_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  expenseTypeBusiness.updateExpenseType(req.params.id, req.body).then( () => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  expenseTypeBusiness.deleteExpenseType(req.params.id).then( result => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
