var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var rsvp = new Schema ({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  sleepPref: {
    type: String,
    required: true
  }
});

var RsvpModel = mongoose.model('rsvp', rsvp);

module.exports.RsvpModel = RsvpModel;
