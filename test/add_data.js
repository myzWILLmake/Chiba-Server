var db = require('../lib/database/connect');

var data = require('./data.json');

// insert to person
var personAddSql = 'INSERT INTO person(phone, password, nickname) VALUES(?,?,?)';
for (i in data.person) {
    db.query(personAddSql, data.person[i]);
}

// insert to event
var eventAddSql = 'INSERT INTO event(manager, title, time, time_stat, location, state) VALUES(?,?,?,?,?,?)';
for (i in data.event) {
    db.query(eventAddSql, data.event[i]);
}

// insert to friend
var friendAddSql = 'INSERT INTO friend(usr0_id, usr1_id) VALUES(?,?)';
for (i in data.friend) {
    db.query(friendAddSql, data.friend[i]);
}

// insert to part_in
var partinAddSql = 'INSERT INTO part_in(event_id, usr_id) VALUES(?,?)';
for (i in data.part_in) {
    db.query(partinAddSql, data.part_in[i]);
}

// insert to launch
var launchAddSql = 'INSERT INTO launch(usr_id, event_id) VALUES(?,?)';
for (i in data.launch) {
    db.query(launchAddSql, data.launch[i]);
}

// insert to decision
var decisionAddSql = 'INSERT INTO decision(event_id, usr_id, type, content) VALUES(?,?,?,?)';
for (i in data.decision) {
    db.query(decisionAddSql, data.decision[i]);
}

var voteAddSql = 'INSERT INTO vote(decision_id, usr_id, type) VALUES(?,?,?)';
for (i in data.vote) {
    db.query(voteAddSql, data.vote[i]);
}

db.end();
