const settings = require('../config/config');
const moment = require('moment');
const jwt = require('jwt-simple');

//Encode
let encodeToken = (username) => {
  const payload = {
      exp: moment().add(10, 'days').unix(),
      iat: moment().unix(),
      sub: username
  };
  return jwt.encode(payload, settings.secretkey);
};

//Decode
let decodeToken = (token, callback) => {
    try {
        const payload = jwt.decode(token, settings.secretkey);

        // Check if the token has expired
        const now = moment().unix();
        if (now > payload.exp) {
            callback('Token has expired!', null);
        } else {
            callback(null, payload);
            return payload.sub;
        }
    } catch (err) {
        callback(err, null);
    }
};

module.exports = {
    encodeToken,
    decodeToken
}