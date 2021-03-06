const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
const config = require('../config/config');
const authController = require('../auth/auth_controller');
const bodyparser = require('body-parser');
const jwt = require('jwt-simple');
const moment = require('moment');

router.all('', (req, res, next) => {
    console.log('test');
});

router.get('/studentenhuis/:shID/maaltijd/:maID/deelnemers', authController.validateToken, (req, res, next) => {
   let studentHouseID = req.params.shID;
   let mealID = req.params.maID;

   let query = ({
       sql: 'SELECT UserID FROM deelnemers WHERE StudentenhuisID =? AND MaaltijdID =?',
       values: [studentHouseID, mealID]
   });

    db.query(query, (error, rows, fields) => {
        if (error) {
            res.status(404);
            res.json({
                "message": "Niet gevonden (huisId of maaltijdId bestaat niet)",
                "code": 404,
                "datetime": moment()
            })
        } else if (rows.length < 1) {
            res.status(404);
            res.json({
                "message": "Niet gevonden (huisId of maaltijdId bestaat niet)",
                "code": 404,
                "datetime": moment()
            })
        } else {
            res.status(200).json(rows);
        }
    })
});

router.post('/studentenhuis/:shID/maaltijd/:maID/deelnemers', authController.validateToken, (req, res, next) => {
    let studentHouseID = req.params.shID;
    let mealID = req.params.maID;

    let token = req.token;
    let payload = jwt.decode(token, config.secretkey);
    let username = payload.sub;
    let userID = 0;

    let userIDQuery = {
        sql: "SELECT ID from user where Email =?",
        values: [username]
    };

    db.query(userIDQuery, (error, rows, fields) => {
        if (error) {
            res.status(404);
            res.json({
                "message": "Niet gevonden (huisID of maaltijdID bestaat niet",
                "code": 404,
                "datetime": moment()
            });
        } else {
            userID = rows[0].ID;
            console.log("USERID: " + userID);
            let query = {
                sql: "INSERT INTO deelnemers (UserID, StudentenhuisID, MaaltijdID) VALUES (?, ?,?)",
                values: [userID, studentHouseID, mealID]
            };

            db.query(query, (error, rows, fields) => {
                if (error) {
                    res.status(409)
                    res.json({
                        "message": "Conflict: Gebruiker is al aangemeld",
                        "code": 409,
                        "datetime": moment()
                    });
                } else {
                    res.status(200).json(rows);
                }

            })
        }
    });
});

router.delete('/studentenhuis/:shID/maaltijd/:maID/deelnemers', authController.validateToken, (req, res, next) => {
    res.contentType('application/json');
    let studentHouseID = req.params.shID;
    let mealID = req.params.maID;
    let token = req.token;

    let payload = jwt.decode(token, config.secretkey);
    let username = payload.sub;

    let userQuery = {
        sql: 'SELECT ID FROM user WHERE Email = "' + username + '"'
    };

    let shIDmaIDquery = {
        sql: 'SELECT ?, ? FROM deelnemers',
        values: [studentHouseID, mealID]
    };

    let userID = 0;

    db.query(shIDmaIDquery, (error, rows, fields) => {
        if (error) {
            console.log("CUNT");
        } else if (rows.length < 1) {
            console.log("testing")
        } else {
            console.log("NAH CUNT")


            db.query(userQuery, (error, rows, fields) => {
                if (error) {
                    res.status(400).json(error);
                } else {
                    userID = rows[0].ID;

                    let query = {
                        sql: 'DELETE FROM deelnemers where UserID =?',
                        values: [userID],
                        timeout: 2000
                    };
                    console.log('Deelnemer DELETE query: ' + query.sql);


                    db.query(query, (error, rows, fields) => {
                        if (error) {
                            res.status(400);
                            console.log("URMUJM")
                            res.json(error);
                        } else {
                            res.status(200);
                            res.json({});
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;