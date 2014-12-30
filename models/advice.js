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
  created: {
    type: Date,
    default: Date.now
  }
});

var AdviceModel = mongoose.model('advice', advice);

module.exports.AdviceModel = AdviceModel;
