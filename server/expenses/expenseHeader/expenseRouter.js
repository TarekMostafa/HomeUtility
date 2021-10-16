const express = require('express');
const ExpenseBusiness = require('./expenseBusiness');

const router = express.Router();
const expenseBusiness = new ExpenseBusiness();

router.get('/', function(req, res, next) {
    expenseBusiness.getExpenses(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.post('/', function(req, res, next) {
    expenseBusiness.addExpense(req.body).then( () => {
    res.messageCode = 'EXP_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

// router.put('/:id', function(req, res, next) {
//   const expenseTypeRequest = new UpdateExpenseTypeRequest(req.body);
//   expenseTypeBusiness.updateExpenseType(req.params.id, expenseTypeRequest).then( () => {
//     res.status(200).send();
//   }).catch( err => {
//     next(err);
//   })
// });

// router.delete('/:id', function(req, res, next) {
//   expenseTypeBusiness.deleteExpenseType(req.params.id).then( result => {
//     res.status(200).send();
//   }).catch( err => {
//     next(err);
//   })
// });

module.exports = router;
