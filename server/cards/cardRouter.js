const express = require('express');
const CardBusiness = require('./cardBusiness');

const router = express.Router();
const cardBusiness = new CardBusiness();

router.get('/', function(req, res, next) {
    cardBusiness.getCards(req.query).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/:id', (req,res,next) => {
    cardBusiness.getCard(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.post('/', function(req, res, next) {
    cardBusiness.addCard(req.body).then( () => {
    res.messageCode = 'CARD_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.put('/:id', function(req, res, next) {
    cardBusiness.updateCard(req.params.id, req.body).then( () => {
    res.messageCode = 'CARD_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.delete('/:id', function(req, res, next) {
    cardBusiness.deleteCard(req.params.id).then( result => {
      res.messageCode = 'CARD_DELETE_SUCCESS';
      next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
