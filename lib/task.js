var dbAdapter = require('./database/adapter');

var md5 = require('md5');

module.exports.run = function(app) {
    app.post('/', function(req, res) {
        res.send('Welcome!');
    });

    app.post('/auth', function(req, res) {
        if (req.session.logged) {
            // Have logged in
            res.json({error: 104});
        } else {
            dbAdapter.auth(req.body.phone, function(err, doc) {
                if (err) {
                    console.log(err);
                    // Something wrong
                    res.json({error: 101});
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

    app.post('person', function(req, res) {
        if (!req.session.logged) {
            res.json({error: 101});
            return;
        }
        
    });
}
