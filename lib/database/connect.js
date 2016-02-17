var mysql = require('mysql');
// database admin information
var adminInfo = require('../../dbadmin.json');
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

module.exports = connection;