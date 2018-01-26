var express = require('express');
var router = express.Router();

/** 메인 화면 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Baton 2.0' });
});

module.exports = router;
