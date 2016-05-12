var mongoose = require('mongoose');

var db = require('./connect');
var schema = require('./schema');

var PersonModel = db.model('Person', schema.person, 'person');
var EventModel = db.model('Event', schema.event, 'event');
var FriendModel = db.model('Friend', schema.friend, 'friend');
var DecisionModel = db.model('Decision', schema.decision, 'decision');
var VoteModel = db.model('Vote', schema.vote, 'vote');

module.exports.auth = function(phone, callback) {
    PersonModel.findOne({'phone': phone}, callback);
};

module.exports.getPersonById = function(_id, callback) {
    PersonModel.findOne({'_id': _id}, callback);
};

module.exports.getPartInEventsByPersonId = function(_id, callback) {
    PersonModel.findOne({'_id': _id}, 'part_in',  callback);
};

module.exports.getEventById = function(_id, callback) {
    EventModel.findOne({'_id': _id}, callback);
};

module.exports.getFriendsByPersonId = function(_id, callback) {
    FriendModel.find({
        $or: [{'usr0_id': mongoose.Types.ObjectId(_id)},{'usr1_id': mongoose.Types.ObjectId(_id)}]
    }, callback);
};

module.exports.getPartInPeopleByEventId = function(_id, callback) {
    EventModel.findOne({'_id': _id}, 'part_in', callback);
};

module.exports.insertEvent = function(obj, callback) {
    var evt = new EventModel({
        manager: db.Types.ObjectId(obj.manager),
        title: obj.title,
        time: new Date(obj.time),
        time_stat: obj.time_stat,
        location: obj.location,
        state: obj.state
    }).save(callback);
};

module.exports.insertPartInPersons = function(obj, callback) {
    var list = [];
    var _id = db.Types.ObjectId(obj._id);
    var partin = obj.partin;
    for (var i in partin) {
        list.push(db.Types.ObjectId(partin[i]));
    }
    var taskCount = partin.length;
    var taskCompleted = function(err) {
      taskCount--;
      if (taskCount==0) {
        callback(null);
      }
    }
    var insertToPerson = function(err) {
      if (err) {
        callback(err);
      }
      for (var person_id in list) {
        var _idObj = db.Types.ObjectId(person_id);
        PersonModel.findById(_idObj, function(err, person) {
          if (err) {
            callback('ERROR: Not find the person!');
            return;
          }
          person.part_in.push(_id);
          var tmp_id = person._id;
          delete person._id;
          PersonModel.update({_id: tmp_id}, person, taskCompleted);
        });
      }
    }
    EventModel.findById(_id, function(err, evt) {
        if (err) {
            callback('ERROR: Not find the event!');
            return;
        }
        evt.part_in = partin;
        delete evt._id;
        EventModel.update({_id: _id}, evt, insertToPerson);
    });
};

module.exports.insertLaunchEvent = function(obj, callback) {
    var usr_id = db.Types.ObjectId(obj.usr_id);
    var evt_id = db.Types.ObjectId(obj.evt_id);
    PersonModel.findById(usr_id, function(err, person) {
        if (err) {
            callback('ERROR: Not find the person!');
            return;
        }
        person.launch.push(evt_id);
        delete person._id;
        PersonModel.update({_id: usr_id}, person, callback);
    });
};

module.exports.insertDecision = function(obj, callback) {
    var evt_id = db.Types.ObjectId(obj.evt_id);
    var usr_id = db.Types.ObjectId(obj.usr_id);
    var type = obj.type;
    var content = obj.content;
    // var agree = obj.agree;
    // var reject = obj.reject;
    var decision = new Decision({
        event_id: evt_id,
        usr_id: usr_id,
        decision_type: type,
        content: content
        // agree: agree,
        // reject: reject
    }).save(callback);
};

module.exports.getDecisionsByEventId = function (_id, callback) {
    DecisionModel.find({event_id: _id}, '_id', callback);
};

module.exports.getDecisionById = function (_id, callback) {
    DecisionModel.findById(_id, callback);
};

module.exports.getVoteByUsrIdDecisionId = function (obj, callback) {
    VoteModel
        .where('usr_id', obj.usr_id)
        .where('decision_id', obj.decision_id)
        .limit(1)
        .exec(callback);
};

module.exports.insertVote = function (obj, callback) {
    var vote = new VoteModel({
        decision_id: db.Types.ObjectId(obj.decision_id),
        usr_id: db.Types.ObjectId(obj.usr_id),
        vote_type: obj.type
    }).save(callback);
};

module.exports.deleteVote = function(obj, callback) {
    VoteModel.remove({
        decision_id: obj.decision_id,
        usr_id: obj.usr_id
    }, callback);
};

module.exports.deleteDecisionById = function(_id, callback) {
    DecisionModel.remove({_id: _id}, callback);
};

module.exports.updateEventByDecision = function (obj, callback) {
    switch (obj.type) {
        case 0: {
            EventModel.findById({_id: obj.event_id}, function(err, evt) {
               if (err) {
                   callback(err);
                   return;
               } else {
                   // TODO: add action when decision type is time
               }
            });
            break;
        }
        case 1: {
            EventModel.findById({_id: obj.event_id}, function(err, evt) {
                if (err) {
                    callback(err);
                    return;
                } else {

                }
            });
            break;
        }
        case 2: {
            EventModel.findById({_id: obj.event_id}, function(err, evt) {
                if (err) {
                    callback(err);
                    return;
                } else {
                    // TODO: add action when decision type is time
                }
            });
            break;
        }
    }
};
