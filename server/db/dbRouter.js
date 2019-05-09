const express = require('express');
const DBBackup = require('./dbBackup');

const router = express.Router();

router.post('/backup', function(req, res, next) {
  DBBackup().then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
