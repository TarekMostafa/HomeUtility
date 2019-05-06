const express = require('express');
const Report = require('./report');

const router = express.Router();
const report = new Report();

router.get('/dropdown', function(req, res, next) {
  report.getReportsForDropDown().then( result => {
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
