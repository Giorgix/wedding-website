var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/:locale', function(req, res, next) {
  res.cookie('locale', req.params.locale);
  res.render('index');
})

module.exports = router;
