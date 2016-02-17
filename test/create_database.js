var db = require('../lib/database/connect');

db.query('ALTER DATABASE chiba_project DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci');
db.query("drop table if exists person");
db.query("drop table if exists event");
db.query("drop table if exists friend");
db.query("drop table if exists part_in");
db.query("drop table if exists launch");
db.query("drop table if exists decision");
db.query("drop table if exists vote");


// create tables
// person
db.query("CREATE TABLE person (" +
        "id         int             PRIMARY KEY AUTO_INCREMENT," +
        "phone      varchar(128)    NOT NULL UNIQUE," +
        "password   varchar(128)    NOT NULL," +
        "nickname   varchar(128)    NOT NULL)");

// event
db.query("CREATE TABLE event (" +
        "id         int             PRIMARY KEY AUTO_INCREMENT," +
        "manager    int             NOT NULL," +
        "title      varchar(128)    NOT NULL," +
        "time       bigint," + // 如果年数是1970 则日期待定
        "time_stat  int," + // 确定时间是不是待定 0 待定 1 确定
        "location   varchar(128)," +
        "state      int             NOT NULL)");

// friend
db.query("CREATE TABLE friend (" +
        "id         int             PRIMARY KEY AUTO_INCREMENT," +
        "usr0_id    int             NOT NULL," +
        "usr1_id    int             NOT NULL)");

// partin
db.query("CREATE TABLE part_in (" +
        "id         int             PRIMARY KEY AUTO_INCREMENT," +
        "event_id   int             NOT NULL," +
        "usr_id     int             NOT NULL)");

// launch
db.query("CREATE TABLE launch (" +
        "id         int             PRIMARY KEY AUTO_INCREMENT," +
        "usr_id     int             NOT NULL," +
        "event_id   int             NOT NULL)");

// decision
db.query("CREATE TABLE decision (" +
        "id         int             PRIMARY KEY AUTO_INCREMENT," +
        "event_id   int             NOT NULL," +
        "usr_id     int             NOT NULL," +
        "type       int             NOT NULL," + // 0 time 1 location 2 add_person
        "content    varchar(128)    NOT NULL," +
        "agree      int             DEFAULT 0," +
        "reject     int             DEFAULT 0)");

// vote
db.query("CREATE TABLE vote (" +
        "id         int             PRIMARY KEY AUTO_INCREMENT," +
        "decision_id int            NOT NULL," +
        "usr_id     int             NOT NULL," +
        "type       int             NOT NULL)");

// to do: add trigger!
db.end();
