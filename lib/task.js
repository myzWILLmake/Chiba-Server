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

    app.post('/auth/logout', function(req, res) {
      if (!req.session.logged) {
        res.json({error: 1});
      } else {
        req.session.logged = false;
        res.json({state: 1});
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
                return;
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

    app.post('/person/launch', function(req, res) {
        // req: {usr_id: xxx, evt_id:xxx}
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.insertLaunchEvent(req.body, function(err) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            } else {
                res.json({state: 1});
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
                return;
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
                    time: evt.time.getTime(),
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
                return;
            }
            if (!docs) {
                // Not find
                res.json({error: 102});
            } else {
                var list = [];
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

    app.post('/event/partin', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.getPartInPeopleByEventId(req.body._id, function(err, doc) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            }
            if (!doc) {
                // Not find
                res.json({error: 102});
            } else {
                var evt = doc.toObject();
                res.json({
                    part_in: evt.part_in
                });
            }
        });
    });

    app.post('/event/new', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.insertEvent(req.body, function(err, obj) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            } else {
                var _id = obj.toObject()._id;
                res.json({_id: _id});
            }
        });
    });

    app.post('/event/new/partin', function(req, res) {
        // req: { _id: xxx, partin: [xxx, xxx]}
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.insertPartInPersons(req.body, function(err) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            } else {
                res.json({state: 1});
            }
        });
    });

    app.post('/decision/new', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.insertDecision(req.body, function (err, obj) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            } else {
                var _id = obj.toObject()._id;
                res.json({_id: _id});
            }
        });
    });

    app.post('/decision/get_by_event', function (req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.getDecisionsByEventId(req.body._id, function(err, docs) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            }
            if (!docs) {
                // Not find
                res.json({error: 102});
            } else {
                var _ids = [];
                for (var i in docs) {
                    _ids.push(docs[i].toObject);
                }
                res.json({_ids: _ids});
            }
        });
    });

    app.post('/decision/id', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.getDecisionById(req.body._id, function(err, doc) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            }
            if (!doc) {
                // Not find
                res.json({error: 102});
            } else {
                var decision = doc.toObject();
                res.json({
                    _id: decision._id,
                    evt_id: decision.event_id,
                    usr_id: decision.usr_id,
                    type: decision.decision_type,
                    content: decision.content,
                    agree: decision.agree,
                    reject: decision.reject
                });
            }
        });
    });

    app.post('/vote/get', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.getVoteByUsrIdDecisionId(req.body, function (err, doc) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            }
            if (!doc) {
                // Not find
                res.json({error: 102});
            } else {
                var vote = doc.toObject;
                res.json({type: vote.vote_type});
            }
        });
    });

    app.post('/vote/new', function (req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.insertVote(req.body, function(err) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            } else {
                res.json({state: 1});
            }
        });
    });

    app.post('vote/remove', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.deleteVote(req.body, function(err) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            } else {
                res.json({state: 1});
            }
        });
    });

    app.post('decision/remove', function(req,res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        dbAdapter.deleteDecisionById(req.body._id, function (err) {
            if (err) {
                console.log(err);
                // Something wrong
                res.json({error: 110});
                return;
            } else {
                res.json({state: 1});
            }
        });
    });


};
