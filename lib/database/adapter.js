var db = require('./connect');
var schema = require('./schema');

var PersonModel = db.model('Person', schema.person, 'person');

module.exports.auth = function(phone, callback) {
    PersonModel.findOne({'phone': phone}, callback);
}
