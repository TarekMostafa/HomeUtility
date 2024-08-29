const express = require('express');
const AppSettings = require('./appSettings');

const router = express.Router();
const appSettings = new AppSettings();

router.get('/', function(req, res, next) {
  appSettings.getAppSettings(req.body).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
});

router.put('/', function(req, res, next){
  appSettings.updateAppSettings(req.body).then( result => {
    if(result.success) {
      req.url = '/api/currencies/updaterates';
      req.method = 'PUT';
      req.app.handle(req, res);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
