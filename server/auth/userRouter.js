const express = require('express');
const User = require('./user');

const router = express.Router();
const user = new User();

router.post('/authenticate', function(req, res, next){
  user.authenticate(req.body).then( result => {
    if(result.success) {
      res.json(result.payload);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

router.post('/changepassword', function(req, res, next){
  user.changePassword(req.body).then( result => {
    if(result.success) {
      res.status(200).send(result.message);
    } else {
      res.status(400).send(result.message);
    }
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
