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

router.get('/:id', (req,res,next) => {
  cardTransactionBusiness.getCardTransaction(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.post('/', function(req, res, next) {
  cardTransactionBusiness.addCardTransaction(req.body).then( () => {
    res.messageCode = 'CARD_TRANS_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.post('/payCardTransactions', function(req, res, next) {
  cardTransactionBusiness.PayCardTransactions(req.body).then( () => {
    res.messageCode = 'CARD_TRANS_PAY_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
  cardTransactionBusiness.updateCardTransaction(req.params.id, req.body).then( () => {
    res.messageCode = 'CARD_TRANS_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
  cardTransactionBusiness.deleteCardTransaction(req.params.id).then( result => {
    res.messageCode = 'CARD_TRANS_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
