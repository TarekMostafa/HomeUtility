const express = require('express');
const User = require('./user');

const router = express.Router();
const user = new User();

router.post('/authentication', function(req, res, next){
  user.authenticate(req.body).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.post('/tokenauthentication', function(req, res, next){
  user.tokenAuthentication(req.body).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
})

router.post('/logout', function(req, res, next){
  user.logout(req.body).then( result => {
    res.messageCode = 'LOGOUT_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
})

router.post('/changepassword', function(req, res, next){
  user.changePassword(req.body).then( result => {
    res.messageCode = 'PASSWORD_CHANGED';
    next();
  }).catch( err => {
    next(err);
  })
})

router.post('/changeusername', function(req, res, next){
  user.changeUserName(req.body).then( result => {
    res.messageCode = 'USER_CHANGED';
    next();
  }).catch( err => {
    next(err);
  })
})

module.exports = router;
