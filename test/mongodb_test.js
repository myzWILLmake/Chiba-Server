var EventEmitter = require('events').EventEmitter;
var e = new EventEmitter();

var mongoose = require('../lib/database/connect');
var PersonSchema = require('../lib/database/schema').person;
var EventSchema = require('../lib/database/schema').event;

var data = require('./data.json');

var PersonModel = mongoose.model('Person', PersonSchema, 'person');
var EventModel = mongoose.model('Event', EventSchema, 'event');

PersonModel.find().exec(function(err, docs) {
    //console.log(docs.toObject());
    for (x in docs) {
        console.log(docs[x].toObject());
    }
})
