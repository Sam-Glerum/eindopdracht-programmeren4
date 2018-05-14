const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
let bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({
    extended: true
}));

/* Login and Registration */

// Login endpoint
router.post('/login', (req, res, next) => {
    let loginParameters = req.body;

    let userName = '';
    let userPW = '';

    let query = {
        sql: 'SELECT Email, Password FROM user WHERE Email = "' + loginParameters.email + '"',
    };

    db.query(query, (error, rows, fields) => {
        if (error) {
            res.status(400);
            res.json(error);
        } else {
            userName = rows[0].Email;
            userPW = rows[0].Password;
            if (userName === loginParameters.email && userPW === loginParameters.password) {
                res.status(200);
                res.json({
                    "token": auth.encodeToken(userName),
                    "username": userName
                });
                console.log("testing");
            }
        }
    });
});

//Registration endpoint
router.post('/register', (req, res, next) => {
    let user = req.body;
    let query = {
        sql: 'INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)',
        values: [user.firstname, user.lastname, user.email, user.password],
        timeout: 2000
    };
    console.log('User query: ' + query.sql);

    res.contentType('application/json');
    db.query(query, (error, rows, fields) => {
        if (error) {
            res.status(400);
            res.json(error);
        } else {
            res.status(200);
            res.json(rows);
        }
    });
});

module.exports = router;