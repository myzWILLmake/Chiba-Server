var db = require('./connect');
var schema = require('./schema');

var PersonModel = db.model('Person', schema.person, 'person');
var EventModel = db.model('Event', schema.event, 'event');
var FriendModel = db.model('Friend', schema.friend, 'friend');

module.exports.auth = function(phone, callback) {
    PersonModel.findOne({'phone': phone}, callback);
}

module.exports.getPersonById = function(_id, callback) {
    PersonModel.findOne({'_id': _id}, callback);
}

module.exports.getPartInEventsByPersonId = function(_id, callback) {
    PersonModel.findOne({'_id': _id}, 'part_in',  callback);
}

module.exports.getEventById = function(_id, callback) {
    EventModel.findOne({'_id': _id}, callback);
}

module.exports.getFriendsByPersonId = function(_id, callback) {
    FriendModel.find({
        $or: [{usr0_id: _id},{usr1_id: _id}]
    }, callback);
}
