const express = require('express');
const _ = require('lodash');
const AppSettings = require('./appSettings');

const router = express.Router();
const appSettings = new AppSettings();

router.get('/', function(req, res, next) {
  appSettings.getAppSettings().then( appSettings => {
    res.json(appSettings);
  }).catch( err => {
    next(err);
  })
});

router.put('/', function(req, res, next){
  appSettings.updateAppSettings(req.body).then( (result) => {
    if(result.status) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
