// require('./_create_table.test.js'); // create the required database tables
var test   = require('tape');
var JWT = require('jsonwebtoken'); // https://github.com/dwyl/learn-json-web-tokens
// we display the file (name) in each test name for stack trace
var dir   = __dirname.split('/')[__dirname.split('/').length-1];
var file  = dir + __filename.replace(__dirname, '') + ' -> ';

var server = require("../lib/server.js"); // load hapi server (the easy way!)

/************************* TESTS ***************************/
test(file + "GET /admin (confirm jwt2 validate blocks invalid sessions)", function(t) {
  var token = JWT.sign({ sid:321 }, process.env.JWT_SECRET);
  var options = {
    method: "GET",
    url: "/admin",
    headers: { authorization: "Bearer "+token }
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 401, "Cannot Access /admin without valid session");
    t.end();
  });
});
//
// var COOKIE;
// test(file+"/login With Valid Data (Success Test)", function(t) {
//   // first register a new account
//   var email = 'dwyl.test+' + Math.floor(Math.random()*1000000)  + '@gmail.com';
//   // console.log(email);
//   var options = {
//     method: "POST",
//     url: "/register",
//     payload : { email: email, password: 'supersecret' }
//   };
//   server.inject(options, function(response) {
//     console.log(response.statusCode);
//     t.equal(response.statusCode, 200, "Registration succeeded for: "+email);
//     options.url = '/login'; // now login
//     server.inject(options, function(response) {
//       t.equal(response.statusCode, 200, "Login Succeeded!");
//       COOKIE = response.headers['set-cookie'][0];
//       var token = response.headers['set-cookie'][0].replace('token=', '');
//       // console.log(token)
//       var decoded = JWT.decode(token);
//       // console.log(decoded);
//       t.equal(decoded.sid.length, 36, 'User ID: ' + decoded.sid);
//       // t.end();
//       var opts = { method: 'GET', url: '/admin', headers: { cookie: COOKIE }}
//       server.inject(opts, function(response){
//         // console.log(' - - - - - - - - - - - - - - - - - - /admin response:');
//         // console.log(response.result);
//         t.equal(response.statusCode, 200, "Admin Page Viewed");
//         t.end();
//       });
//     });
//   });
// });

test.onFinish(function () {
  server.stop(function(){});
})
