var mysql = require('mysql');
var adminInfo = require('../dbadmin.json');

var connection = mysql.createConnection({
    host: adminInfo.host,
    user: adminInfo.user,
    password: adminInfo.password,
    database: adminInfo.database
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

connection.query("drop table if exists person");
connection.query("drop table if exists event");
connection.query("drop table if exists friend");
connection.query("drop table if exists part_in");
connection.query("drop table if exists decision");
connection.query("drop table if exists vote");


// create tables
// person
connection.query("CREATE TABLE person (" +
            "id         int             PRIMARY KEY AUTO_INCREMENT," +
            "phone      varchar(128)    NOT NULL UNIQUE," +
            "password   varchar(128)    NOT NULL," +
            "nickname   varchar(128)    NOT NULL)");

// event
connection.query("CREATE TABLE event (" +
            "id         int             PRIMARY KEY AUTO_INCREMENT," +
            "manager    int             NOT NULL," +
            "title      varchar(128)    NOT NULL," +
            "time       int," + // 如果年数是1970 则日期待定
            "time_stat  int," + // 确定时间是不是待定 0 待定 1 确定
            "location   varchar(128)," +
            "state      int             NOT NULL)");

// friend
connection.query("CREATE TABLE friend (" +
            "id         int             PRIMARY KEY AUTO_INCREMENT," +
            "usr0_id    int             NOT NULL," +
            "usr1_id    int             NOT NULL)");

// partin
connection.query("CREATE TABLE part_in (" +
            "id         int             PRIMARY KEY AUTO_INCREMENT," +
            "event_id   int             NOT NULL," +
            "usr_id     int             NOT NULL)");

// decision
connection.query("CREATE TABLE decision (" +
            "id         int             PRIMARY KEY AUTO_INCREMENT," +
            "event_id   int             NOT NULL," +
            "usr_id     int             NOT NULL," +
            "type       int             NOT NULL," + // 0 time 1 location 2 add_person
            "content    varchar(128)    NOT NULL," +
            "agree      int             DEFAULT 0," +
            "reject     int             DEFAULT 0)");

// vote
connection.query("CREATE TABLE vote (" +
            "id         int             PRIMARY KEY AUTO_INCREMENT," +
            "decision_id int            NOT NULL," +
            "usr_id     int             NOT NULL," +
            "type       int             NOT NULL)");

// to do: add trigger!
connection.end();
