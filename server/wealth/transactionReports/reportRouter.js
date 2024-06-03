const express = require('express');
const Report = require('./report');

const router = express.Router();
const report = new Report();

router.get('/dropdown', function(req, res, next) {
  report.getReportsForDropDown().then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});

router.get('/reportDetails/:id', function(req, res, next) {
  report.getReportDetails(req.params.id).then( result => {
    res.json(result);
  }).catch( err => {
    next(err);
  })
});  

router.post('/editReport/:id?', function(req, res, next) {
  report.editReport(req.params.id, req.body).then( result => {
    res.messageCode = 'REPORT_UPDATE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.post('/deleteReport/:id?', function(req, res, next) {
  report.deleteReport(req.params.id).then( result => {
    res.messageCode = 'REPORT_DELETE_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

router.post('/addNewReport', function(req, res, next) {
  report.addNewReport(req.body).then( result => {
    res.messageCode = 'REPORT_ADD_SUCCESS';
    next();
  }).catch( err => {
    next(err);
  })
});

module.exports = router;
