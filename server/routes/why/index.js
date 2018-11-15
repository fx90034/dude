const express = require('express');
const router = express.Router();
const debug = require('debug')('http');
const db = require('../../models/why');

router.get('/main', function(req, res) {
  res.render('why/main');
});

router.get('/concern', function(req, res) {
  let user = null;
  if(req.session.user)
    user = req.session.user.name;
debug("why/concern!!")
debug('user = ' + user)
debug('ip = ' + req.ip)
debug('concern = ' + req.query.value)
  db.concern.addConcern(req.query.value, req.ip, user, function(err, body) {
  });
  res.render('why/cost');
});


module.exports = router;
