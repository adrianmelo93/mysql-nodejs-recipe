//import express package
var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'flashcards'
});

//create web app
var app = express();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');


//configure web app
// app.get('/', function(req, res){
//   res.end("hello world")
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/users/register', function(req, res){
  if(!req.body || !req.body.username || !req.body.password){
    return res.sendStatus(400);
  }
  var salt = bcrypt.genSaltSync(3);
  var hashedPassword = bcrypt.hashSync(req.body.password, salt);
  console.log("here is what I would be saving to db",
            req.body.username, hashedPassword);
  var query = `INSERT INTO users (username, hashed_pasword)
              VALUES('${req.body.username}', '${hashedPassword}')`;
  connection.query(query, function(err, result){
    if(err){
      return res.status(500).send(err);
    }
    res.json(result);
    console.log("DB request succeeded");
  });
});


app.post('/users/login', function(req, res){
  if(!req.body || !req.body.username || !req.body.password){
    return res.sendStatus(400);
  }
  var query = `select * from users where username='${req.body.username}'`;
  connection.query(query, function(err, rows){
    if(err){
      console.log("Error looking up user");
      return res.sendStatus(500);
    }
    if(rows.length != 1){
    console.log("Multiple or no users found");
    return res.sendStatus(500);
    }
    var userInDB = rows[0];
    var isPasswordCorrect = bcrypt.compareSync(req.body.password, userInDB.hashed_pasword);
    if(!isPasswordCorrect){
    console.log("Faild at logging in with bad password");
    res.sendStatus(401);
    return;
    }
  res.sendStatus(200);
});
});

require('./flashCards.js')(app, connection);
//make web app listen
app.listen(8889);
