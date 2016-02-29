var express = require('express');

var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

var db = require('./lib/database/connect');

var md5 = require('md5');

//var auth = require('./lib/auth');
var PersonSchema = require('./lib/database/schema');
var PersonModel = db.model('Person', PersonSchema, 'person');


var app = express();
app.listen(9000);

app.use(session({
    secret: 'Akagi.moe',
    store: new MongoStore({
        url: 'mongodb://localhost/chiba_project',
        ttl: 1 * 24 * 60 * 60
    }),
}));

app.use(bodyParser.json());

function getRes(phone, callback) {
    PersonModel.findOne({'phone': phone},'phone password', callback);
}

app.post('/', function(req, res) {
    if (req.session.logged) {
        res.send('已经登录');
    } else {
        getRes(req.body.phone, function(err, person) {
            if (err) {
                res.end(err);
                return;
            };
            if (person._doc.password == md5(req.body.pass)) {
                req.session.logged = true;
                res.end('登陆成功！');
            } else {
                res.end('验证失败');
            }
        })
    }
});
