const auth = require('./authentication');
let ApiError = require('../model/ApiError');

let validateToken = (req, res, next) => {
    console.log("Validate token called");
    const bearerHeader = req.headers["authorization"];
    if (typeof  bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(401);
        next();
    }
};
module.exports = {
    validateToken
};