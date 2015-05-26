var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('*', function(req, res, next) {
  console.log(req.secure);
    if (!req.secure) {
        //FYI this should work for local development as well
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
});

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/lang/:locale', function(req, res, next) {
  res.cookie('locale', req.params.locale);
  res.redirect('/');
})

module.exports = router;
