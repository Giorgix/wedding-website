var express = require('express');
var router = express.Router();
var passport = require('passport');
//require('.././config/passport')(passport);
  
  // GET ADMIN HOME ===================================
  router.get('/', isLoggedIn, function(req, res) {
    res.render('profile', {user: req.user});
  });
  // LOGIN ======================================
  router.get('/login', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/admin/profile');
    } else {
      res.render('login');
    }
  });
  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin/profile',
    failureRedirect: '/admin/login',

    failureFlash: true
  }))
  
  // SIGNUP =======================================
  router.get('/signup', function(req, res) {
    if(req.isAuthenticated()) {
      res.redirect('/admin/profile');
    } else {
      res.render('signup');
    }
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/admin/profile',
    failureRedirect: '/admin/signup',

    failureFlash: true
  }));
  // PROFILE =======================================
  router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {user : req.user})
  })
  // LOGOUT ========================
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  })

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.render('login', {message: 'You need to login'});
  }
module.exports = router;
