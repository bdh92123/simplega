var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 3,
  host: '192.168.1.2',
  user: 'root',
  database: 'simplega',
  password: '20606'
});

var query = function (queryString, values) {
  return new Promise(function(resolve, reject){
    pool.getConnection((err, connection)=>{
      connection.query(queryString, values, function (err, rows) {
        if (err) {
          reject(err);
          connection.release();
          return;
        }
        resolve(rows);
        connection.release();
      });
    });
  });
};


var queryOne = function (queryString, values) {
  return new Promise(function(resolve, reject){
    pool.getConnection((err, connection)=>{
      connection.query(queryString, values, function (err, rows) {
        if (err) {
          reject(err);
          connection.release();
          return;
        }
        resolve(rows[0]);
        connection.release();
      });
    });
  });
}

module.exports = {
  pool: pool,
  query: query,
  queryOne: queryOne
};
