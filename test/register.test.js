var test   = require('tape');
// we display the file (name) in each test name for stack trace
var dir   = __dirname.split('/')[__dirname.split('/').length-1];
var file  = dir + __filename.replace(__dirname, '') + ' -> ';

var server = require("../lib/server.js"); // load hapi server (the easy way!)
// require('./_create_table.test.js');
/************************* TESTS ***************************/
test(file + "GET /register (expect to see reg form)", function(t) {
  var options = {
    method: "GET",
    url: "/register"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    t.end();
  });
});

test(file+'Attempt to submit a registration without password', function(t){
  var options = {
    method: "POST",
    url: "/register",
    payload : { email:'this@here.net' }
  };

  server.inject(options, function(response) {
    // joi returns 400 when auth validation fails.
    var code = response.statusCode
    t.equal(code, 400, 'Register without password fails -> '+code);
    t.end();
  });
})

test(file+'Attempt to register with unrecognised field', function(t){
  var options = {
    method: "POST",
    url: "/register",
    payload : { email:'this@here.net', password: 'pass4567', id:123 }
  };

  server.inject(options, function(response) {
    // joi returns 400 when auth validation fails.
    var code = response.statusCode
    t.equal(code, 400, 'Register with unknown field fails -> '+code);
    t.end();
  });
})

var EMAIL = 'alex.' + Date.now() + '@example.net'

test(file+"Register with email and password", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : { email:EMAIL, password: 'pass4567' }
  };

  server.inject(options, function(response) {
    // console.log(response.result);
    t.equal(response.statusCode, 200, "Register worked with email and password");
    t.end();
  });
});

test(file+"Attempt to re-register with the same email address", function(t) {
  var options = {
    method: "POST",
    url: "/register",
    payload : { email:EMAIL, password: 'pass4567' }
  };

  server.inject(options, function(response) {
    t.equal(response.statusCode, 400, "Attempt to Re-register does not work!");
    t.end()
  });
});

test.onFinish(function () {
  server.stop(function(){ console.log('Done.'); }); // stop the hapi server
  process.exit();
});
