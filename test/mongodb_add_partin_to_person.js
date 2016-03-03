var EventEmitter = require('events').EventEmitter;
var e = new EventEmitter();

var mongoose = require('../lib/database/connect');
var PersonSchema = require('../lib/database/schema').person;
var EventSchema = require('../lib/database/schema').event;

var data = require('./data.json');

var PersonModel = mongoose.model('Person', PersonSchema, 'person');
var EventModel = mongoose.model('Event', EventSchema, 'event');

var eventAll = [];
var personAll = [];

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].toString() == obj.toString()) {
            return true;
        }
    }
    return false;
}

finalWork = function() {
    for (var i in personAll) {
        var person = personAll[i];
        var list = [];
        for (var j in eventAll) {
            var eventx = eventAll[j];
            if (contains(eventx.part_in, person._id)) {
                list.push(eventx._id);
            }
        }
        PersonModel.update({_id: person._id}, {$set: {part_in: list}}, function(err) {
            if (err) console.log(err);
        });
    }
}

callbackP = function(err, doc) {
    for (var i in doc) {
        personAll.push(doc[i].toObject());
    }
    EventModel.find().exec(function(err, doc) {
        for (var i in doc) {
            eventAll.push(doc[i].toObject());
        }
        console.log(personAll);
        console.log(eventAll);
        finalWork();
    });
}

PersonModel.find().exec(callbackP);
