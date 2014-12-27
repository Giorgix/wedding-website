var dbURI = 'mongodb://localhost:27017/wedding-test'
  , should = require('chai').should()
  , mongoose = require('mongoose')
  , supertest = require('supertest')
  , api = supertest('http://localhost:3000/api')
  , Dummy = require('.././models/rsvp.js').RsvpModel
  , clearDB = require('mocha-mongoose')(dbURI, {noClear: true})
  ;

describe("Basic dummy model db operations", function() {
  before(function(done) {
    if(mongoose.connection.db) return done();
    mongoose.connect(dbURI, done)
  });

  beforeEach(function(done) {
    clearDB(done);
  });
  beforeEach(function(done) {
    Dummy.create({firstName: 'Pepe'
                , lastName: 'Perez'
                , email: 'email@email.com'
                , sleepPref: 'Madrid'
                },done);
                  
  });

  it("can be listed", function(done){
    Dummy.find({}, function(err, docs) {
      if(err) return done(err);
      docs.length.should.equal(1);
      done();
    });
  });
})
