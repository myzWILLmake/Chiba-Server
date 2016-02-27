var mongoose = require('../lib/database/connect');
var DecisionSchema = require('../lib/database/schema').decision;
var PersonSchema = require('../lib/database/schema').person;
var VoteSchema = require('../lib/database/schema').vote;

var data = require('./data.json');

var DecisionModel = mongoose.model('Decision', DecisionSchema, 'decision');
var PersonModel = mongoose.model('Person', PersonSchema, 'person');
var VoteModel = mongoose.model('Vote', VoteSchema, 'vote');

for (x in data.vote) {
    (function(i){
        PersonModel.findOne({
            'phone': data.vote[i][1]
        }, '_id', function(err, person) {
            if (err) {
                console.log('find person' + err);
            } else {
                var voteEntity = new VoteModel({
                    decision_id: mongoose.Types.ObjectId(data.vote[i][0]),
                    usr_id: person._id,
                    vote_type: data.vote[i][2]
                }).save(function(err) {
                    if (err) console.log('save vote' + err);
                });
            }
        });
    })(x);
}
