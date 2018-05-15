const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
const config = require('../config/config');
const authController = require('../auth/auth_controller');
const bodyparser = require('body-parser');
const jwt = require('jwt-simple');
const moment = require('moment');

router.all('/studentenhuis/maaltijd', (req, res, next) => {
    // let studentHouseId = req.param.shId;
    next();
    // res.status(200);
    // res.send("POST request to studentenhuis/" /**+ studentHouseId */+ "/maaltijd")
    // console.log("POST request to studentenhuis/" + /**+ studentHouseId */ + "/maaltijd")
});

// Get a specific meal by it's id
router.get('/studentenhuis/:shId/maaltijd/:maId', (req, res, next) => {
    let studentHouseId = req.params.shId;
    let mealId = req.params.maId;
    console.log("GET studentenhuis/" + studentHouseId + "/maaltijd/" + mealId);

    db.query('SELECT * FROM maaltijd WHERE ID = ' + mealId + ' AND StudentenhuisID = ' + studentHouseId, (error, rows, fields) => {
        console.log(rows);
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    });
});

// Get all meals that are connected to one specific student house
router.get('/studentenhuis/:shId/maaltijd', (req, res, next) => {
    let studentHouseId = req.params.shId;
    console.log("GET studentenhuis/" + studentHouseId + "/maaltijd");

    db.query('SELECT * FROM maaltijd WHERE StudentenhuisID = ' + studentHouseId, (error, rows, fields) => {
        console.log(rows);
        if (error) {
            res.status(400).json(error);
        } else if (rows.length == 0) {
            res.status(404);
            res.json({
                "message": "Niet gevonden (huisId bestaat niet)",
                "code": 404,
                "datetime": moment()
            });
        } else {
            res.status(200).json(rows);
        }
    });
});

router.post('/studentenhuis/:shId/maaltijd', authController.validateToken, (req, res, next) => {
    res.contentType('application/json');
    let studentHouseId = req.params.shId;
    let maaltijd = req.body;
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
                sql: 'INSERT INTO maaltijd (Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES (?, ?, ?, ?, ?, ?, ?)',
                values: [maaltijd.naam, maaltijd.beschrijving, maaltijd.ingredienten, maaltijd.allergie, maaltijd.prijs, userID, studentHouseId],
                timeout: 2000
            };
            console.log('maaltijd POST query: ' + query.sql);


            db.query(query, (error, rows, fields) => {
                if (typeof maaltijd.naam === "undefined" || typeof maaltijd.beschrijving === "undefined" ||
                    typeof maaltijd.ingredienten === "undefined" || typeof maaltijd.allergie === "undefined" ||
                    typeof maaltijd.prijs === "undefined") {
                    res.status(412);
                    res.json({
                        "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                        "code": 412,
                        "datetime": moment()
                    });

                } else if (error) {
                    res.status(400);
                    res.json(error);
                } else {
                    res.status(200);
                    console.log("POST successful!");
                    res.json(rows);
                }
            });
        }
    });
});

router.put('/studentenhuis/:shId/maaltijd/:maId', authController.validateToken, (req, res, next) => {
    res.contentType('application/json');
    let studentHouseId = req.params.shId;
    let mealId = req.params.maId;

    console.log("shID: " + studentHouseId);
    console.log("maID: " + mealId);

    let maaltijd = req.body;
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
            console.log("userID: " + userID);
        }


        let ownerOfMealQuery = {
            sql: 'SELECT UserID FROM Maaltijd WHERE StudentenhuisID = ' + studentHouseId + ' AND ID = ' + mealId + '',
        };

        console.log(ownerOfMealQuery.sql);

        let ownerOfMealID = 0;

        db.query(ownerOfMealQuery, (error, rows, fields) => {
            if (error) {
                res.status(400).json(error);

            } else {

                if (rows[0] === undefined) {
                    res.status(404);
                    res.json({
                        message: 'Niet gevonden (huisId of maaltijdId bestaat niet)',
                        code: '404',
                        datetime: moment()
                    });

                } else {
                    ownerOfMealID = rows[0].UserID;
                    console.log("ownerOfMealID: " + ownerOfMealID);

                    if (userID === ownerOfMealID) {
                        let query = {
                            sql: 'UPDATE `maaltijd` SET Naam=? , Beschrijving=? , Ingredienten=? , Allergie=? , Prijs=? WHERE ID = ? AND studentenhuisID = ? AND UserID = ?',
                            values: [maaltijd.naam, maaltijd.beschrijving, maaltijd.ingredienten, maaltijd.allergie, maaltijd.prijs, mealId, studentHouseId, userID],
                            timeout: 2000,
                        };

                        console.log("Maaltijd PUT query: " + query.sql);

                        db.query(query, (error, rows, fields) => {
                            if (typeof maaltijd.naam === "undefined" || typeof maaltijd.beschrijving === "undefined" ||
                                typeof maaltijd.ingredienten === "undefined" || typeof maaltijd.allergie === "undefined" ||
                                typeof maaltijd.prijs === "undefined") {
                                res.status(412);
                                res.json({
                                    "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                                    "code": 412,
                                    "datetime": moment()
                                });

                            } else if (error) {
                                res.status(400);
                                res.json(error);

                            } else {
                                res.status(200);
                                console.log("PUT successful!");
                                res.json(rows);
                            }
                        });

                    } else {
                        console.log("ID of owner and visitor are not equal!");
                        res.status(409);
                        res.json({
                            message: 'ID of owner and visitor are not equal!',
                            code: '409',
                            datetime: moment()
                        })
                    }
                }
            }
        });
    });
});

router.delete('/studentenhuis/:shId/maaltijd/:maId', authController.validateToken, (req, res, next) => {
    res.contentType('application/json');
    let studentHouseId = req.params.shId;
    let mealId = req.params.maId;

    console.log("shID: " + studentHouseId);
    console.log("maID: " + mealId);

    let maaltijd = req.body;
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
            console.log("userID: " + userID);
        }


        let ownerOfMealQuery = {
            sql: 'SELECT UserID FROM Maaltijd WHERE StudentenhuisID = ' + studentHouseId + ' AND ID = ' + mealId + '',
        };

        console.log(ownerOfMealQuery.sql);

        let ownerOfMealID = 0;

        db.query(ownerOfMealQuery, (error, rows, fields) => {
            if (error) {
                res.status(400).json(error);

            } else {

                if (rows[0] === undefined) {
                    res.status(404);
                    res.json({
                        message: 'Niet gevonden (huisId of maaltijdId bestaat niet)',
                        code: '404',
                        datetime: moment()
                    });

                } else {
                    ownerOfMealID = rows[0].UserID;
                    console.log("ownerOfMealID: " + ownerOfMealID);

                    if (userID === ownerOfMealID) {
                        let query = {
                            sql: 'DELETE FROM `maaltijd` WHERE ID = ' + mealId + '',
                        };

                        console.log("Maaltijd DELETE query: " + query.sql);

                        db.query(query, (error, rows, fields) => {
                            if (error) {
                                res.status(400);
                                res.json(error);
                            } else {
                                res.status(200);
                                console.log("DELETE successful!");
                                res.json(rows);
                            }
                        });

                    } else {
                        console.log("ID of owner and visitor are not equal!");
                        res.status(409);
                        res.json({
                            message: 'ID of owner and visitor are not equal!',
                            code: '409',
                            datetime: moment()
                        })
                    }
                }
            }
        });
    });
});

module.exports = router;