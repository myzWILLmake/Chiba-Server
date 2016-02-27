var mongoose = require('../lib/database/connect');
var PersonSchema = require('../lib/database/schema').person;
var EventSchema = require('../lib/database/schema').event;

var data = require('./data.json');

var PersonModel = mongoose.model('Person', PersonSchema, 'person');
var EventModel = mongoose.model('Event', EventSchema, 'event');

for (x in data.event) {
    // find the manager
    (function(i) {
        PersonModel.findOne({
            'phone': data.event[i][0]
        }, '_id', function(err, person) {
            // console.log(person); peron._id
            var eventEntity = new EventModel({
                manager: person._id,
                title: data.event[i][1],
                time: new Date(data.event[i][2]),
                time_stat: data.event[i][3],
                location: data.event[i][4],
                state: data.event[i][5]
            }).save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    })(x);
}
