const express = require('express');
const router = express.Router();
const debug = require('debug')('http');

router.get('/main',
  function(req, res) {
    res.render('why/main');
  }
);


module.exports = router;
