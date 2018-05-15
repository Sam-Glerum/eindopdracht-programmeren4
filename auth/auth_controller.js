const auth = require('./authentication');
let ApiError = require('../model/ApiError');

// let validateToken = (req, res, next) => {
//     console.log('validateToken called');
//     let token =  (req.header('X-Access-Token')) || '';
//     // let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
//
//     auth.decodeToken(token, (err, payload) => {
//         if (err) {
//             // Invalid token
//             const error = new ApiError(err.message || err, 401);
//             console.log(error);
//             next();
//         } else {
//             console.log('Authenticated! Payload = ');
//             console.dir(payload);
//             req.user = payload.sub;
//             next();
//         }
//     })
// };

let validateToken = (req, res, next) => {
    console.log("Validate token called");
    const bearerHeader = req.headers["authorization"];
    if (typeof  bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    } else {
        res.sendStatus(403);
        next();
    }
};
module.exports = {
    validateToken
};



/*
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjcxODk5NDYsImlhdCI6MTUyNjMyNTk0Niwic3ViIjoicGV0ZXJAcGFuamEuY29tIn0.5e1kpoinLAfxliAwvEZhmiGRzpB6HpJ5cmIo2u3OdPs",
    "username": "peter@panja.com"
}
*/