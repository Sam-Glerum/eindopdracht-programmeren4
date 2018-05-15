const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
const config = require('../config/config');
const authController = require('../auth/auth_controller');
const bodyparser = require('body-parser');
const jwt = require('jwt-simple');

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
            console.log("test");
            res.status(400).json(error);
        } else if (rows.length < 1){
            res.status(404);
            res.send("Niet gevonden (huisID of maaltijdID bestaat niet");
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
            res.status(400).json(error);
        } else {
            userID = rows[0].ID;
            console.log("USERID: " + userID);
            let query = {
                sql: "INSERT INTO deelnemers (UserID, StudentenhuisID, MaaltijdID) VALUES (?, ?,?)",
                values: [userID, studentHouseID, mealID]
            };

            db.query(query, (error, rows, fields) => {
                if (error) {
                    res.status(400).json(error);
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

    let userID = 0;

    db.query(userQuery, (error, rows, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            userID = rows[0].ID;
            console.log(userID);

            let query = {
                sql: 'DELETE FROM deelnemers where UserID =?',
                values: [userID],
                timeout: 2000
            };
            console.log('Deelnemer DELETE query: ' + query.sql);


            db.query(query, (error, rows, fields) => {
                if (error) {
                    res.status(400);
                    res.json(error);
                } else {
                    res.status(200);
                    res.json(rows);
                }
            });
        }
    });
});

module.exports = router;