const express = require('express');
const HomeBusiness = require('./homeBusiness');

const router = express.Router();
const homeBusiness = new HomeBusiness();

router.get('/', function(req, res, next) {
    homeBusiness.getTotals(req.body).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

module.exports = router;