var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/main', function(req, res, next) {
  res.render('main');
});

router.get('/mirror', function(req, res, next) {
  res.render('mirror');
});

module.exports = router;
