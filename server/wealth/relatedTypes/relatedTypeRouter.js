const express = require('express');
const RelatedTypeBusiness = require('./relatedTypeBusiness');

const router = express.Router();
const relatedTypeBusiness = new RelatedTypeBusiness();

router.get('/', function(req, res, next) {
  relatedTypeBusiness.getRelatedTypes().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
