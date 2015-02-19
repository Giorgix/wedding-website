var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var advice = new Schema ({
  name: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  image: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  aproved: {
    type: Boolean,
    required: true,
    default: false
  }
});

var AdviceModel = mongoose.model('advice', advice);

module.exports.AdviceModel = AdviceModel;
