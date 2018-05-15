const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
const config = require('../config/config');
const authController = require('../auth/auth_controller');
const bodyparser = require('body-parser');
const jwt = require('jwt-simple');

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
                "msg": "Requested house id not found!"
            })
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
            console.log('Studenthuis query: ' + query.sql);


            db.query(query, (error, rows, fields) => {
                if (error) {
                    res.status(400);
                    res.json(error);
                } else {
                    res.status(200);
                    console.log("POST TETST!");
                    res.json(rows);
                }
            });
        }
    });
});

router.put('/studentenhuis/:shId/maaltijd/:maId', (req, res, next) => {

});

module.exports = router;