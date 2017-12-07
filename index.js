var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});
//////
app.get('/messages', function (req, res, next) {
  setTimeout(() => {
    res.json({hello: "World"})
  }, 500);
});

app.get('/clocks', function (req, res, next) {
  const start = new Date().getTime();
  while (new Date().getTime() < start + 100);
  res.json({hello: "World"})
});

app.get('/atan2/:count', (req, res, next) => {
  let x = 0;
  for (let i = 0; i < req.params.count; i++) {
    x = Math.atan2(Math.random(), Math.random());
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(x));
})

app.get('/rockets', function (req, res, next) {
  throw new Error('Kaboom!');
});

app.get('/beverages', function (req, res, next) {
  console.error("418: I'm a teapot");
  res.status(418).send("I'm a teapot"); // https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol
});

app.get('/maps', function (req, res, next) {
  process.exit(1);
});

const mem = [];
app.get('/pipes', function (req, res, next) {
  mem.push(new Uint8Array(50000));
  res.json({hello: "World"})
});

// http://buildnewgames.com/garbage-collector-friendly-code/
app.get('/bins', function (req, res, next) {
  const func = () => {
    global.x = new Array(1000);
  }
  for (let i = 0; i < 1000; i++) func();
  res.json({hello: "World"})
});
app.get('/children', function (req, res, next) {
  var exec = require('child_process').exec;
  var cmd = 'sleep 1m';
  exec(cmd, function (error, stdout, stderr) {
    // command output is in stdout
  });
  res.json({hello: "World"})
});
//////
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
