var mongoose = require('../lib/database/connect');
var DecisionSchema = require('../lib/database/schema').decision;
var PersonSchema = require('../lib/database/schema').person;
var EventSchema = require('../lib/database/schema').event;

var data = require('./data.json');

var DecisionModel = mongoose.model('Decision', DecisionSchema, 'decision');
var PersonModel = mongoose.model('Person', PersonSchema, 'person');
var EventModel = mongoose.model('Event', EventSchema, 'event');

for (x in data.decision) {
    (function(i) {
        EventModel.findOne({
            'title': data.decision[i][0]
        }, '_id', function(err, event) {
            if (err) {
                console.log('find event' + err);
            } else {
                PersonModel.findOne({
                    'phone': data.decision[i][1]
                }, '_id', function(err, person) {
                    if (err) {
                        console.log('find person' + err);
                    } else {
                        var decisionEntity = new DecisionModel({
                            event_id: event._id,
                            usr_id: person._id,
                            decision_type: data.decision[i][2],
                            content: data.decision[i][3]
                        }).save(function(err) {
                            if (err) console.log('save' + err);
                        });
                    }
                });
            }
        });
    })(x);
}
