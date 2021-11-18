const express = require('express');
const CardTransactionBusiness = require('./cardTransactionBusiness');

const router = express.Router();
const cardTransactionBusiness = new CardTransactionBusiness();

router.get('/', function(req, res, next) {
    cardTransactionBusiness.getCardsTransactions(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

// router.get('/:id', (req,res,next) => {
//   cardInstallmentBusiness.getCardInstallment(req.params.id).then( result => {
//     res.json(result);
//   }).catch( err => {
//     next(err);
//   })
// })

// router.post('/', function(req, res, next) {
//   cardInstallmentBusiness.addCardInstallment(req.body).then( () => {
//     res.messageCode = 'CARD_INST_ADD_SUCCESS';
//     next();
//   }).catch( err => {
//     next(err);
//   })
// });

// router.put('/:id', function(req, res, next) {
//   cardInstallmentBusiness.updateCardInstallment(req.params.id, req.body).then( () => {
//     res.status(200).send();
//   }).catch( err => {
//     next(err);
//   })
// });

// router.delete('/:id', function(req, res, next) {
//   cardInstallmentBusiness.deleteCardInstallment(req.params.id).then( result => {
//     res.status(200).send();
//   }).catch( err => {
//     next(err);
//   })
// });

module.exports = router;
