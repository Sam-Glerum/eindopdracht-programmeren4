const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
const bodyparser = require('body-parser');
const moment = require('moment');
const regex = require('regex-email');

router.use(bodyparser.urlencoded({
    extended: true
}));
// router.use(bodyparser.json);
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

            } else if (regex.test(loginParameters.email) === false) {
                res.status(409);
                res.json({
                    "message": "Ongeldig emailadres",
                    "code": 409,
                    "datetime": moment()
                });

            } else if (typeof rows[0] === 'undefined') {
                res.status(404);
                res.json({
                    "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                    "code": 412,
                    "datetime": moment()
                });

            } else {

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
                    res.status(401);
                    res.json({
                        "message": "Wachtwoord is onjuist",
                        "code": 412,
                        "datetime": moment()
                    });
                }
            }
        }
    );
});

//Registration endpoint
router.post('/register', (req, res, next) => {
    let user = req.body;
    let query = {
        sql: 'INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)',
        values: [user.firstname, user.lastname, user.email, user.password],
        timeout: 2000
    };

    let userquery = {
        sql: 'SELECT ID from user WHERE Email =?',
        values: [user.email]
    };

    console.log('User query: ' + query.sql);

    res.contentType('application/json');

    if (typeof user.firstname === 'undefined' || typeof user.lastname === 'undefined'
        || typeof user.email === 'undefined' || typeof user.password === 'undefined'
        || user.firstname.length < 2 || user.lastname.length < 2) {
        res.status(412);
        res.json({
            "message": "Een of meer properties in de request body ontbreken of zijn foutief",
            "code": 412,
            "datetime": moment()
        });
    } else if (regex.test(user.email) === false) {
        res.status(409);
        res.json({
            "message": "Ongeldig emailadres",
            "code": 409,
            "datetime": moment()
        });
    } else {

        db.query(userquery, (error, rows, fields) => {
            if (error) {
                res.json(error)
            } else if (rows.length < 1) {
                db.query(query, (error, rows, fields) => {
                    if (error) {
                        console.log("test");
                    } else if (rows.length < 1) {
                        res.status(412);
                        res.json({
                            "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                            "code": 412,
                            "datetime": moment()
                        });
                    } else {
                        res.status(200);
                        res.json({
                            "token": auth.encodeToken(user.email),
                            "email": user.email
                        });
                    }
                });
            } else {
                res.status(409).json({"message": "Het opgegeven emailadres is reeds in gebruik"})
            }
        })
    }

});

module.exports = router;