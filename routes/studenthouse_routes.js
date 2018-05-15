const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
const config = require('../config/config');
const authController = require('../auth/auth_controller');
const bodyparser = require('body-parser');
const jwt = require('jwt-simple');
const moment = require('moment');

router.use(bodyparser.urlencoded({
    extended: true
}));

router.all('/studentenhuis', authController.validateToken, (req, res, next) => {
    next();
});

router.get('/studentenhuis', authController.validateToken, (req, res, next) => {
    res.contentType('application/json');
    console.log("GET api/studentenhuis called");

    db.query('SELECT * FROM studentenhuis', (error, rows, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    })
});

router.get('/studentenhuis/:ID', authController.validateToken, (req, res, next) => {
    res.contentType('application/json');
    let houseId = req.params.ID;
    console.log('GET api/studentenhuis/:id called');

    db.query('SELECT * FROM studentenhuis where ID = ' + houseId, (error, rows, fields) => {
        console.log(rows);
        if (error) {
            res.status(400).json(error);
        } else if (rows.length < 1) {
            res.status(404);
            res.json({
                "message": "Niet gevonden (huisID bestaat niet)",
                "code": 404,
                "datetime": moment()
            })
        } else {
            res.status(200).json(rows);
        }
    });
});

router.post('/studentenhuis', authController.validateToken, (req, res, next) => {
    res.contentType('application/json');
    let studentenhuis = req.body;
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

            let query = {
                sql: 'INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (?, ?, ?)',
                values: [studentenhuis.naam, studentenhuis.adres, userID],
                timeout: 2000
            };
            console.log('Studenthuis query: ' + query.sql);


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
                    res.json({
                        "ID": userID,
                        "naam": studentenhuis.naam,
                        "adres": studentenhuis.adres,
                        "contact": userID,
                        "email": username
                    });
                }
            });
        }
    });
});

router.put('/studentenhuis/:ID', authController.validateToken, (req, res, next) => {
    let studentHouse = req.body;
    let studentHouseID = req.params.ID;

    let query = {
        sql: "UPDATE studentenhuis SET Naam=?, adres=? WHERE ID=?",
        values: [studentHouse.naam, studentHouse.adres, studentHouseID]
    };

    console.dir(studentHouse);
    console.log('Studenthouse query: ' + query.sql);

    res.contentType('application/json');
    db.query(query, (error, rows, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    })
});

router.delete('/studentenhuis/:ID', authController.validateToken, (req, res, next) => {
    let studentHouseID = req.params.ID;

    let query = {
        sql: "DELETE FROM studentenhuis WHERE ID=?",
        values: [studentHouseID]
    };

    console.log('Delete Query: ' + query.sql);

    res.contentType('application/json');
    db.query(query, (error, rows, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    })
});

module.exports = router;