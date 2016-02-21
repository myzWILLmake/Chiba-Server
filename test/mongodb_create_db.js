var mongoose = require('../lib/database/connect')
var PersonSchema = require('../lib/database/schema').person;

var PersonModel = mongoose.model('Person', PersonSchema, 'person');

var personEntity = new PersonModel({
    phone: '18868129246',
    password: 'q1w2e3r4',
    nickname: 'Yunze'
});

personEntity.save(function(err) {
    if (err)
        console.log(err);
});
