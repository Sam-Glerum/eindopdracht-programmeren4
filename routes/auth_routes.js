const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
const bodyparser = require('body-parser');
const moment = require('moment');

router.use(bodyparser.urlencoded({
    extended: true
}));

/* Login and Registration */

// Login endpoint
router.post('/login', (req, res, next) => {
    let loginParameters = req.body;

    let userName = '';
    let userPW = '';
    let userId = 0;

    let query = {
        sql: 'SELECT ID, Email, Password FROM user WHERE Email = "' + loginParameters.email + '"',
    };

    db.query(query, (error, rows, fields) => {
        if (error) {
            res.status(412);
            res.json({
                "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                "code": 412,
                "datetime": moment()
            });

        } else {
            try {
                userId = rows[0].ID;
                userName = rows[0].Email;
                userPW = rows[0].Password;
                if (userName === loginParameters.email && userPW === loginParameters.password) {
                    res.status(200);
                    res.json({
                        "token": auth.encodeToken(userName),
                        "username": userName,
                        "ID": userId
                    });
                }
            } catch (e) {
                console.log(e);
            userId = rows[0].ID;
            userName = rows[0].Email;
            userPW = rows[0].Password;
            if (userName === loginParameters.email && userPW === loginParameters.password) {
                res.status(200);
                res.json({
                    "token": auth.encodeToken(userName),
                    "username": userName,
                    "ID": userId
                });
            } else {
                res.status(412);
                res.json({
                    "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                    "code": 412,
                    "datetime": moment()
                });
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
            res.status(412);
            res.json({
                "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                "code": 412,
                "datetime": moment()
            });
        } else {
            res.status(200);
            res.json(rows);
        }
    });
});

module.exports = router;