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
      console.warn(err);
      res.send(err);
    } else {
      getData(Rsvps, res);
    }
  });
});


module.exports = router;
