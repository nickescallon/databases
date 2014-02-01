var mysql = require('mysql');
var Q = require('q');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  host: "localhost",
  user: "batman",
  password: "",
  database: "chattler"
});

dbConnection.connect();

var insertObj = {
  username: 'bob',
  text: 'hello mars',
  roomname: 'applo 19'
};


var insert = function(data, table, column, cb) {
  dbConnection.query('INSERT INTO '+table+' SET '+column+'=?', data, cb);
};

var query = function(data, table, column, cb) {
  var queryString;
  queryString = 'SELECT * FROM '+table;
  if (data && column) {
    queryString += ' WHERE '+column+'=?';
    dbConnection.query(queryString, data, cb);
  } else {
    dbConnection.query(queryString, cb);
  }
};

var checkKey = function(data, table, column, cb){
  query(data, table, column, function(err, results){
    if (err){
      throw new Error('Error querying db', err);
    }
    if (results.length === 0) {
      insert(data, table, column, cb);
    } else {
      cb(null, results[0]);
    }
  });
};

var insertMessage = function(data, cb) {
  dbConnection.query('INSERT INTO messages SET ?', data, cb);
}

checkKey(insertObj.username, 'users', 'name', function(err, user){
  checkKey(insertObj.roomname, 'chatrooms', 'roomname', function(err2, room){
    
    var user_id = user.insertId || user.id;
    var room_id = room.insertId || room.id;

    insertMessage({text: insertObj.text, id_users: user_id, id_chatrooms: room_id}, function(err3, result){
      if (err3) {
        console.log('Error inserting message to db', err3);
      } else {
        console.log('Inserted message of id: ', result.insertId);
      }
    });
  });
});


// var promisedQuery = Q.somethingify(dbConnection.query);

// Q.map([
//   promisedQuery(args1),
//   promisedQuery(args2)]
//   ).then(
//   promisedQuery(args3).
//   then(success,error))
//   .fail();

//To insert obj above into the database

//on post handle the obj form the request
//check if username, roomname exist

//query username in user
  //if there, return user_id
  //else insert username to user, which returns user_id

//do same as above for roomname

//once we have user_id and room_id,
  //add message to messages with user_id and room_id

//on success return 201 to user
  //else return 500




// insert('hello again', 'messages', 'text', function(err, result){
//   if (err){
//     console.log('Error inserting data', err);
//   } else {
//     console.log('Inserted ' + result.insertId + ' into database.');
//   }
// });

// query(undefined, 'messages', undefined, function(err, result){
//   console.log('query1', result);
// });

// query('hello again', 'messages', 'text', function(err, result){
//   console.log('query2', result);
// })

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */
