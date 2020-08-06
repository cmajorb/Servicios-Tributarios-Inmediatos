var express = require('express');
var http = require('http');
var path = require('path');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mysqlx = require('@mysql/xdevapi');

var app = express();
var server = http.Server(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());

app.set('port', process.env.PORT);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', authenticateToken, (req, res) => {
  res.json({ message: "access granted"});
});

app.post('/login', (req, res) => {
  mysqlx
    .getSession({
      user: 'root',
      password: 'root',
      host: 'db',
      port: '33060'
    }).then(function (s) {
        session = s;
        return session.getSchema('mysql');
    }).then(function () {
      return session
        .sql("SELECT Password FROM mysql.Users WHERE UserName = '"+req.body.username+"';")
        .execute()
    }).then(function (result) {
      var data = result.fetchAll();
        if (data.length > 0 && req.body.password === data[0][0]) {
          const token = generateAccessToken({ username: req.body.username });
          res.json({token: token, result: 'valid'});
        } else {
          res.send({result: 'invalid'});
        }
    });
});

app.post('/register', (req, res) => {
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const rucRegexp = /^[0-9]{1,20}$/;
console.log(rucRegexp.test(req.body.ruc));
console.log(req.body.name.length);
  if (emailRegexp.test(req.body.email) && rucRegexp.test(req.body.ruc) && req.body.name.length > 0 && req.body.password.length > 6 && req.body.username.length > 0) {
    query = ['UserName','Name','RUC','Email','Password','RegisterDate'];
    data = [req.body.username,req.body.name,req.body.ruc,req.body.email,req.body.password,new Date().toISOString().slice(0, 19).replace('T', ' ')]

    mysqlx
      .getSession({
        user: 'root',
        password: 'root',
        host: 'db',
        port: '33060'
      }).then(function (s) {
          session = s;
          return session.getSchema('mysql');
      }).then(function () {
        return session
          .sql("SELECT * FROM mysql.Users WHERE UserName = '"+req.body.username+"';")
          .execute()
      }).then(function (result) {
        var dataResults = result.fetchAll();
        console.log("data:" + dataResults + ":" + dataResults.length);
        if(dataResults.length==0) {
          mysqlx
            .getSession({
              user: 'root',
              password: 'root',
              host: 'db',
              port: '33060'
            }).then(function (session) {
              const token = generateAccessToken({ username: req.body.username });
              res.json({token: token, result: 'valid'});
            myTable = session.getSchema('mysql').getTable('Users');
            return myTable
              .insert(query)
              .values(data)
              .execute()
          });
        } else {
          res.send({result: 'invalid'});
        }
      });


  } else {
    res.send({result: 'invalid'});
  }

});

app.get('/login', function(request, response) {
  response.sendFile(path.join(__dirname, 'login.html'));

});
app.get('/register', function(request, response) {
  response.sendFile(path.join(__dirname, 'register.html'));
});

function authenticateToken(req, res, next) {
  console.log("authenticating");
  // Gather the jwt access token from the request header
  //const authHeader = req.headers['authorization']
  //const token = authHeader && authHeader.split(' ')[1]
  const token = req.cookies.token;
  console.log("token: "+token);
  if (token == null) return res.redirect('/login'); // if there isn't any token

  jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
    if (err) return res.redirect('/login');
    next() // pass the execution off to whatever request the client intended
  });
}

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

server.listen(process.env.PORT, function() {
  console.log('Starting server on port '+process.env.PORT);
});
