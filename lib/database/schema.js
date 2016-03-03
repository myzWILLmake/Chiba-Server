var db = require('./connect');

module.exports.person = new db.Schema({
    phone: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    nickname: {
        type: String,
        require: true
    },
    launch: [{
        type: db.Schema.ObjectId,
        ref: 'event'
    }],
    part_in: [{
        type: db.Schema.ObjectId,
        ref: 'event'
    }]
});

module.exports.event = new db.Schema({
    manager: {
        type: db.Schema.ObjectId,
        ref: 'person',
        require: true
    },
    title: {
        type: String,
        require: true
    },
    time: {
        type: Date // 如果年份是1970，则日期待定
    },
    time_stat: {
        type: Boolean // 用来确定时间是否确定 false 待定 true 确定
    },
    location: {
        type: String
    },
    state: {
        type: Number,
        require: true
    },
    part_in: [{
        type: db.Schema.ObjectId,
        ref: 'person'
    }]
});

module.exports.friend = new db.Schema({
    usr0_id: {
        type: db.Schema.ObjectId,
        ref: 'person',
        require: true
    },
    usr1_id: {
        type: db.Schema.ObjectId,
        ref: 'person',
        require: true
    }
});
/* integrate with event collection
module.exports.part_in = new db.Schema({
    event_id: {
        type: db.Schema.ObjectId,
        ref: 'event',
        require: true
    },
    usr_id: {
        type: db.Schema.ObjectId,
        ref: 'person',
        require: true
    }
});
*/
/* integrate with person collection
module.exports.launch = new db.Schema({
    usr_id: {
        type: db.Schema.ObjectId,
        ref: 'person',
        require: true
    },
    event_id: {
        type: db.Schema.ObjectId,
        ref: 'event',
        require: true
    }
});
*/
module.exports.decision = new db.Schema({
    event_id: {
        type: db.Schema.ObjectId,
        ref: 'event',
        require: true
    },
    usr_id: {
        type: db.Schema.ObjectId,
        ref: 'person',
        require: true
    },
    decision_type: {
        type: Number, // 0 time 1 location 2 add_person
        require: true
    },
    content: {
        type: String,
        require: true
    },
    agree: {
        type: Number,
        default: 0
    },
    reject: {
        type: Number,
        default: 0
    }
});

module.exports.vote = new db.Schema({
    decision_id: {
        type: db.Schema.ObjectId,
        ref: 'decision',
        require: true
    },
    usr_id: {
        type: db.Schema.ObjectId,
        ref: 'person',
        require: true
    },
    vote_type: {
        type: Number,
        require: true
    }
});
