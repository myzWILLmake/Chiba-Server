var express = require('express');

var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

var task = require('./lib/task');

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

task.run(app);
