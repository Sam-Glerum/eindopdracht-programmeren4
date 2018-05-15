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
       sql: 'SELECT UserID FROM maaltijd WHERE StudentenhuisID =? AND ID =?',
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

module.exports = router;