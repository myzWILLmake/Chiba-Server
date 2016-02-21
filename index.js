var express = require('express');

var session = require('express-session');

var app = express();
app.listen(9000);

app.use(session({
    secret: 'Akagi.moe',
}));

app.post('/', function(req, res) {
    if (req.session.isVisit) {
        req.session.isVisit++;
        res.send('<p> 第' + req.session.isVisit + '次</p>');
    } else {
        req.session.isVisit = 1;
        res.send("欢迎");
        console.log(req.session);
    }
})
