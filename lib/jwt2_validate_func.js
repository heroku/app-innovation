/**
 * validate follows the standard format for hapi-auth-jwt2
 * we expect the decoded JWT to have a 'sid' key which has a valid session id.
 * If the sid is in the sessions table of the database and end_timestamp has
 * not been set, (i.e. null), we know the session is valid.
 */
module.exports = function validate (decoded, request, callback) {
  var select = 'SELECT * FROM sessions WHERE (session_id = $1)';
  request.pg.client.query(select, [ decoded.sid ], function(err, result) {
    if(!err && result.rows[0] && result.rows[0].end_timestamp === null) {
      return callback(null, true);
    }
    else {
      console.log('      > Session is INVALID!');
      return callback(err, false);
    }
  });
};
