var md5 = require('md5');

var mongoose = require('../lib/database/connect')
var PersonSchema = require('../lib/database/schema').person;

var data = require('./data.json');

var PersonModel = mongoose.model('Person', PersonSchema, 'person');

for (i in data.person) {
    var personEntity = new PersonModel({
        phone: data.person[i][0],
        password: md5(data.person[i][1]),
        nickname: data.person[i][2]
    }).save(function(err) {
        if (err) {
            console.log(err);
        }
    })
}
