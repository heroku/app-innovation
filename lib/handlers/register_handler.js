var bcrypt = require('bcrypt');    // https://github.com/nelsonic/bcrypt
var escape = require('pg-escape'); // https://github.com/segmentio/pg-escape
var help = require('../helpers');   // helpers used to prepare the reply
var Hoek = require('hoek');  // show errors in console without killing app


function create_person (request, reply) {
  var email = help.escape(request.payload.email);
  var name = help.escape(request.payload.name);
  var password = help.escape(request.payload.password);
  var select = escape('SELECT * FROM people WHERE (email = %L)', email);
  // console.log('select: ', select);
  request.pg.client.query(select, function(err, result) {
    if (err || result.rowCount === 0) { // user does not exist register!
      bcrypt.genSalt(12, function(err, salt) {  // encrypt the password:
        bcrypt.hash(password, salt, function(err, hash) {
          var q = 'INSERT INTO %s (email, name, password) VALUES (%L, %L, %L)';
          var insert = escape(q, 'people', email, name, hash);
          request.pg.client.query(insert, function(err, result) {
            // at this point we should not be getting an error...
            Hoek.assert(!err, 'ERROR: inserting data into Postgres', err);
            return reply.view('success', {
              name  : name, // escaped above
              email : email // also escaped
            });
          });
        }); // end bcrypt.hash
      }); // end bcrypt.genSalt
    }
    else { // if there is no error SELECTING the User, it Exists!!
      return reply.view('index', {
        title: 'Sorry, Please try a different email address!',
        error  : { email: {
          message: 'That email address has already been registered.'}
        }, // yes, this is a deeply nested error object, it needs to be.
        values : {      // return the *escaped* form data
          email: email, // so the person does not have to re-type it!
          name: name,
          password: password // undecided if we should send back the password
        } // what do you think? should we re-set/clear the password field...?
      }).code(400);
    }
  }); // END request.pg.client.query
}

/**
 * register_handler checks if someone with a given email address is already
 * registered in the app. If not, we register the person and hash their password
 * else we reject registration with a message informing that the email is
 * already registered to someone else. (should we offer a re-set password form?)
 * @param {Object} request - the standard Hapi request object. note: we are
 *  using the hapi-postgres-connection so request has pg.client available.
 * @param {Object} reply - the standard Hapi reply interface
 * @param {Object} source - this will be the *source* of any validation errors
 * @param {Object} error - a Joi validation error if there was one.
 */
module.exports = function register_handler(request, reply, source, error) {
  if (request.method === 'get') { // get does not send payload so return reg
    return reply.view('index', { title : 'Please Register' }).code(200);
  }
  // console.log(error);
  if(!request.payload || request.payload && error && error.data) { // joi error
    return reply.view('index', {
      title  : 'Please Register ' + request.server.version,
      error : help.extract_validation_error(error), // error field & message
      values : help.return_form_input_values(error) // avoid wiping form data
    }).code(400);
  } // this block is essentially doing *manual* Joi validation to show html!
  else { // the payload was valid, lets see if the person has already registered
    return create_person(request, reply);
  }
}
