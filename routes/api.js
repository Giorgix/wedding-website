var express = require('express');
var router = express.Router();

// MODELS ===================================
var rsvps = require('.././models/rsvp.js').RsvpModel;

function getData(model, res) {
  model.find(function(err, data) {
    if(err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
};

//TODO create a resubale function with callback
function createItem(model, item_json, res) {
  model.create(item_json, function(err, data) {
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
      getData(model, res);
    }
  });

}

function removeItem(model, id, res) {
  model.findById(id, function (err, data){
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
          getData(model, res);
        }
      });
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


router.get('/rsvps', function(req, res) {
  getData(rsvps, res);
})

router.post('/rsvps', function(req, res) {
  createItem(rsvps, req.body, res);
  });

router.delete('/rsvps/:id', isLoggedIn, function(req, res) {
  removeItem(rsvps, req.params.id, res);
})


module.exports = router;
