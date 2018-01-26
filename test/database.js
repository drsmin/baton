process.env.NODE_ENV = 'dev';

var mysql    = require('mysql');
var dbconfig = require(__dirname + '/../config/database.js');
var conn     = mysql.createConnection(dbconfig);

conn.connect();

conn.query('SELECT :abc ', {'abc' : 123}, function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.', err);
});

conn.end();