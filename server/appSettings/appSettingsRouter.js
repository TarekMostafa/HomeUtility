const express = require('express');
const AppSettings = require('./appSettings');

const router = express.Router();
const appSettings = new AppSettings();

router.get('/', function(req, res, next) {
  appSettings.getAppSettings(req.body).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.put('/', function(req, res, next){
  appSettings.updateAppSettings(req.body).then( result => {
    console.log(result);
    req.url = '/api/currencies/updaterates';
    req.method = 'PUT';
    req.app.handle(req, res);
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
