const express = require('express');
const RelatedType = require('./relatedType');

const router = express.Router();
const relatedType = new RelatedType();

router.get('/', function(req, res, next) {
  relatedType.getRelatedTypes().then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
