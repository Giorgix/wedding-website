var express = require('express');
var router = express.Router();

// MODELS ===================================
var Rsvps = require('.././models/rsvp.js').RsvpModel;

function getData(model, res) {
  model.find(function(err, data) {
    if(err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.status(401);
    res.send('You need to login');
  }


router.route('/rsvps')
.get(function(req, res) {
  getData(Rsvps, res);
})

.post(function(req, res) {
  Rsvps.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    sleepPref: req.body.sleepPref
  }, function(err, data) {
    if(err) {
      if(err.code === 11000) {
        res.status(500);
        res.send('There is an user with that email');
      } else {
      console.warn(err);
      res.status(500);
      res.send(err.message);
      }
    } else {
      getData(Rsvps, res);
    }
  });
});

router.delete('/rsvps/:id', isLoggedIn, function(req, res) {
  Rsvps.findById(req.params.id, function (err, data){
    if(!data) {
      res.status(500);
      res.send('No item with that id');
    } else if(err){
      res.status(500);
      res.send(err);
    } else {
      data.remove(function(err) {
        if(err) {
          res.status(500);
          res.send(err);
        } else {
          // res.status(removed)
          getData(Rsvps, res);
        }
      });
    }
  })
})


module.exports = router;
