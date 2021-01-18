let mysql = require('mysql');
let db = mysql.createConnection({
  host    : 'localhost',
  user    : 'root',
  password: 'zxcvZXCV',
  database: 'myPage',
  charset : 'utf8mb4'
});
db.connect();
module.exports = db;
