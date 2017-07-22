var help = require('../helpers');
var bcrypt = require('bcrypt');    // https://github.com/nelsonic/bcrypt
var JWT = require('jsonwebtoken'); // https://github.com/dwyl/learn-json-web-tokens
var aguid = require('aguid'); // https://github.com/dwyl/aguid

/**
 * reject the client's with an error message and status code 401
 * @param {Object} request - the standard hapi request object
 * @param {Object} reply - the standard hapi reply interface
 * see below for example usage.
 */
 function reject (request, reply) {
   return reply.view('index', {
     title: 'Login Failed: Email Address or Password incorrect',
     error  : { email: {
       message: 'Sorry, that email or password is incorrect. Please try again.'}
     }, // yes, this is a deeply nested error object extracted in the view
     values : { email: help.escape(request.payload.email) }
   }).code(401);
 }

/**
 * check_password_and_reply does what its name suggests: checks the
 * password stored in the database for the person, if the password is correct,
 * i.e. bcrypt.compare is a match, create a new session for the person,
 * else, reply with the login form and error messages
 */
function check_password_and_reply (request, reply, result) {
  var pw = request.payload.password;
  var hash = result.rows[0].password;
  bcrypt.compare(pw, hash, function(err, res) { // check password match
    console.log(err, res);
    if(!err && res === true) { // no error and password matches
      // insert new session
      var q = 'INSERT INTO sessions (session_id, person_id) VALUES ($1, $2)';
      var sid = aguid();
      request.pg.client.query(q, [ sid, result.rows[0].id ], function(err, res) {
        var token = JWT.sign({
          sid: sid,
          exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60
        }, process.env.JWT_SECRET);
        return reply.view('admin', {
          name  : result.rows[0].name || 'Friend',
          email : help.escape(request.payload.email)
        }).state("token", token); // set the cookie with options;
      });
    }
    else {
      return reject(request, reply);
    }
  });
}

/**
 * login_handler is a dual-purpose handler that initially renders
 * the login form but is re-used to display the form with any
 * Joi validation errors to the client until they input valid data!
 * @param {Object} request - the hapi request object
 * @param {Object} reply - the standard hapi reply object
 * @param {String} source - source of the invalid field e.g: 'payload'
 * @param {Object} error - the error object prepared for the client
 * response (including the validation function error under error.data
 */
function login_handler(request, reply, source, error) {
  // show the registration form until its submitted correctly
  if(!request.payload || request.payload && error) {
    var errors, values; // return empty if not set.
    if(error && error.data) { // only attempt to extract errors if they exist
      errors = help.extract_validation_error(error); // the error field + message
      values = help.return_form_input_values(error); // avoid wiping form data
    }
    return reply.view('index', { // render the login form
      title  : 'Please Register ' + request.server.version,
      error  : errors, // error object used in html template
      values : values  // (escaped) values displayed in form inputs
    }).code(error ? 400 : 200);
  }
  else { // no errors and the payload has valid email, lets look it up in DB:
    var select = 'SELECT * FROM people WHERE (email = $1)';
    // console.log('select: ', select);
    request.pg.client.query(select, [ request.payload.email ], function(err, result) {
      // console.log(err, result);
      if (!err && result.rowCount === 1) { // email exists, lets check password
        return check_password_and_reply(request, reply, result);
      }
      else { // email did not exist in the database so we reply accordingly
        return reject(request, reply);
      }
    }); // END request.pg.client.query
  }
}

module.exports = login_handler;
