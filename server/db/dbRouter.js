const express = require('express');
const DBBackup = require('./dbBackup');

const router = express.Router();

router.post('/backup', function(req, res, next) {
  DBBackup().then( result => {
    res.messageCode = 'DB_BACKUP_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
