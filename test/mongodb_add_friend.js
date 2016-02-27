var mongoose = require('../lib/database/connect');

var PersonSchema = require('../lib/database/schema').person;
var FriendSchrma = require('../lib/database/schema').friend;

var data = require('./data.json');

var PersonModel = mongoose.model('Person', PersonSchema, 'person');
var FriendModel = mongoose.model('Friend', FriendSchrma, 'friend');

for (x in data.friend) {
    (function(i) {
        PersonModel.findOne({
            'phone': data.friend[i][0]
        }, '_id', function(err, person_x) {
            if (err) {
                console.log('person_x \n' + err);
            }
            PersonModel.findOne({
                'phone': data.friend[i][1]
            }, '_id', function(err, person_y) {
                if (err) {
                    console.log('person_y \n' + err);
                }
                var friendEntity = new FriendModel({
                    usr0_id: person_x._id,
                    usr1_id: person_y._id
                }).save(function(err) {
                    if (err) {
                        console.log('add friend \n' + err);
                    }
                });
            });
        });
    })(x);
}
