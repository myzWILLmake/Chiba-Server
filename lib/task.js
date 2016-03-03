var dbAdapter = require('./database/adapter');

var md5 = require('md5');

module.exports.run = function(app) {
    app.post('/', function(req, res) {
        res.send('Welcome!');
    });

    app.post('/auth', function(req, res) {
        if (req.session.logged) {
            // Have logged in
            res.json({error: 101});
        } else {
            dbAdapter.auth(req.body.phone, function(err, doc) {
                if (err) {
                    console.log(err);
                    // Something wrong
                    res.json({error: 110});
                    return;
                }
                if (!doc) {
                    // Wrong account
                    res.json({error: 102});
                } else {
                    var person = doc.toObject();
                    // to do: encrypt the pass at clients!
                    if (person.password == md5(req.body.pass)) {
                        req.session.logged = true;
                        res.json({
                            _id: person._id,
                            phone: person.phone,
                            nickname: person.nickname
                        });
                    } else {
                        // Wrong passowrd
                        res.json({error: 103});
                    }
                }
            });
        }
    });

    app.post('/person/id', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.getPersonById(req.body._id, function(err, doc) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            }
            if (!doc){
                // Not find the person
                res.json({error: 102})
            } else {
                var person = doc.toObject();
                res.json({
                    _id: person._id,
                    phone: person.phone,
                    nickname: person.nickname
                });
            }
        });
    });

    app.post('/person/partin', function(req,res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.getPartInEventsByPersonId(req.body._id, function(err, doc) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
            }
            if (!doc) {
                // Not find the person
                res.json({error: 102});
            } else {
                var person = doc.toObject();
                res.json({
                    part_in: person.part_in
                });
            }
        });
    });

    app.post('/event/id', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.getEventById(req.body._id, function(err, doc) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
            }
            if (!doc) {
                // Not find the person
                res.json({error: 102});
            } else {
                var evt = doc.toObject();
                res.json({
                    _id: evt._id,
                    manager: evt.manager,
                    title: evt.title,
                    time: evt.time,
                    time_stat: evt.time_stat,
                    location: evt.location,
                    state: evt.state
                });
            }
        });
    });

    app.post('/friend/id', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.getFriendsByPersonId(req.body._id, function(err, docs) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
            }
            if (!doc) {
                // Not find
                res.json({error: 102});
            } else {
                var list;
                for (var i in docs) {
                    var friend = docs[i].toObject();
                    if (friend.usr0_id.toString() == req.body._id.toString()) {
                        list.push(friend.usr1_id);
                    } else {
                        list.push(friend.usr0_id);
                    }
                }
                res.json({
                    friends: list
                });
            }
        });
    });

}
