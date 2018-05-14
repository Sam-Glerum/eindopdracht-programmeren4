const auth = require('authentication');

let validateToken = (req, res, next) => {
    console.log('validateToken called');
    const token = req.header('x-access-token') || '';

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            // Invalid token
            const error = new ApiError(err.message || err, 401);
            next(error);
        } else {
            console.log('Authenticated! Payload = ');
            console.dir(payload);
            req.user = payload.sub;
            next();
        }
    })
};

module.exports = validateToken;