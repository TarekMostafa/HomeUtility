const express = require('express');
const DBBackup = require('./dbBackup');

const router = express.Router();

router.post('/backup', function(req, res, next) {
  DBBackup().then( () => {
    res.status(200).send();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
