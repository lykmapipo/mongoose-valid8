'use strict';

//dependencies
var path = require('path');
var async = require('async');
var faker = require('faker');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var valid8 = require(path.join(__dirname, '..', 'index'));
mongoose.plugin(valid8);

//create user model
var past = faker.date.past(4);
var UserSchema = new Schema({
    dob: {
        type: Date,
        required: true,
        isBefore: {
            message: 'Birth date must be before ' + past,
            date: past
        }
    }
});
mongoose.model('User', UserSchema);


before(function(done) {
    //setup database
    mongoose.connect('mongodb://localhost/mongoose-valid8', done);
});

/**
 * @description wipe all mongoose model data and drop all indexes
 */
function wipe(done) {
    var cleanups = mongoose.modelNames()
        .map(function(modelName) {
            //grab mongoose model
            return mongoose.model(modelName);
        })
        .map(function(Model) {
            return async.series.bind(null, [
                //clean up all model data
                Model.remove.bind(Model),
                //drop all indexes
                Model.collection.dropAllIndexes.bind(Model.collection)
            ]);
        });

    //run all clean ups parallel
    async.parallel(cleanups, done);
}

//clean database
after(function(done) {
    wipe(function(error) {
        if (error && error.message !== 'ns not found') {
            done(error);
        } else {
            done(null);
        }
    });
});