var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
  
  name: {
    type: String,
  },
  
  text: {
    type: String,
  }

});

var imageSchema = new Schema({
  url: {
    type: String,
    require: true,
    unique: true
  },
  urlThumb: {
    type: String,
    require: true,
    unique: true
  }
});

var album = new Schema ({
  
  title: {
    type: String,
    require: true
  },
  
  images: [imageSchema],
  
  created: {
    type: Date,
    default: Date.now
  }
});

var AlbumModel = mongoose.model('album', album);

module.exports.AlbumModel = AlbumModel;
