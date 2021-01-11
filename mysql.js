let mysql = require('mysql');
let connection = mysql.createConnection({
  host    : 'localhost',
  user    : 'root',
  password: 'zxcvZXCV',
  database: 'myPage'
});

connection.connect();

connection.query('select * from guest', function (error, results, fields){
  if(error){
    console.log(error);
  }
  console.log(results);
});

connection.end();
