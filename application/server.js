var express = require('express');
var http = require('http');
var path = require('path');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');


var app = express();
var server = http.Server(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.set('port', process.env.PORT);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', authenticateToken, (req, res) => {
  res.json({ message: "access granted"});
});

app.post('/login', (req, res) => {
  console.log("checking name: ");
  console.log(req.body.username)
  const token = generateAccessToken({ username: req.body.username });
  res.json(token);
});
app.get('/login', function(request, response) {
  response.sendFile(path.join(__dirname, 'login.html'));
});

function authenticateToken(req, res, next) {
  console.log("authenticating");
  // Gather the jwt access token from the request header
  //const authHeader = req.headers['authorization']
  //const token = authHeader && authHeader.split(' ')[1]
  const token = req.query.token;
  console.log("token: "+token);
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
    //console.log(err)
    console.log(decoded)
    if (err) return res.sendStatus(403)
    next() // pass the execution off to whatever request the client intended
  });
}

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

server.listen(process.env.PORT, function() {
  console.log('Starting server on port '+process.env.PORT);
});
