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
    unique: true,
    required: true
  },
  assist: {
    type: Boolean,
    require: true
  },
  sleepPref: {
    type: String
  }
});

var RsvpModel = mongoose.model('rsvp', rsvp);

module.exports.RsvpModel = RsvpModel;
