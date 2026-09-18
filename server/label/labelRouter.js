const express = require('express');
const LabelBusiness = require('./labelBusiness');

const router = express.Router();
const labelBusiness = new LabelBusiness();

router.get('/', function(req, res, next) {
  labelBusiness.getLabels(req.query, req.body).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

module.exports = router;