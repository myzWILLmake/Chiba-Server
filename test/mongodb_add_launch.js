var EventEmitter = require('events').EventEmitter;
var e = new EventEmitter();

var mongoose = require('../lib/database/connect');
var PersonSchema = require('../lib/database/schema').person;
var EventSchema = require('../lib/database/schema').event;

var data = require('./data.json');

var PersonModel = mongoose.model('Person', PersonSchema, 'person');
var EventModel = mongoose.model('Event', EventSchema, 'event');

var list = [];

e.on('add_to_list', function(x, person, event) {
    if (!list[x]) list[x] = [];
    list[x].push(event._id);
    if (list[x].length == (data.launch[x].length - 1)) {
        person.launch = list[x];
        var _id = person._id;
        delete person._id;
        PersonModel.update({_id: _id}, person, function(err) {
            if (err) {
                console.log('update person' + err);
            }
        })
    }
});

for (x in data.launch) {
    (function(i) {
        PersonModel.findOne({
            'phone': data.launch[i][0]
        }, function(err, person) {
            if (err) {
                console.log('find person' + err);
            }
            for (var j = 1; j < data.launch[i].length; j++) {
                EventModel.findOne({
                    'title': data.launch[i][j]
                }, '_id', function(err, event) {
                    if (err) {
                        console.log('find event' + err);
                    }
                    e.emit('add_to_list', i, person, event);
                });
            }
        });
    })(x);
}
