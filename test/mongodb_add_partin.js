var EventEmitter = require('events').EventEmitter;
var e = new EventEmitter();

var mongoose = require('../lib/database/connect');
var PersonSchema = require('../lib/database/schema').person;
var EventSchema = require('../lib/database/schema').event;

var data = require('./data.json');

var PersonModel = mongoose.model('Person', PersonSchema, 'person');
var EventModel = mongoose.model('Event', EventSchema, 'event');

var list = [];

e.on('add_to_list', function(x, event, person) {
    if (!list[x]) list[x] = [];
    list[x].push(person._id);
    //console.log(list[x]);
    if (list[x].length == (data.part_in[x].length-1)) {
        event.part_in = list[x];
        var _id = event._id;
        delete event._id;
        EventModel.update({_id: _id}, event, function(err) {
            if (err) {
                console.log('update event' + err);
            }
        });
    }
});

for (x in data.part_in) {
    (function(i) {
        EventModel.findOne({
            'title': data.part_in[i][0]
        }, function(err, event) {
            if (err) {
                console.log('add part_in to event when find event \n' + err);
            }
            for (var j = 1; j < data.part_in[i].length; j++) {
                PersonModel.findOne({
                    'phone': data.part_in[i][j]
                }, '_id', function(err, person) {
                    if (err) {
                        console.log('add part_in to event when find person \n' + err);
                    }
                    e.emit('add_to_list', i, event, person);
                });
            }
        });
    })(x);
}
