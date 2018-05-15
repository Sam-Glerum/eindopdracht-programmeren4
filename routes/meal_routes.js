const express = require('express');
const router = express.Router();
const db = require('../config/db');

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
    console.log("GET studentenhuis/" + studentHouseId +"/maaltijd/" + mealId);

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
    console.log("GET studentenhuis/" + studentHouseId +"/maaltijd");

    db.query('SELECT * FROM maaltijd WHERE StudentenhuisID = ' + studentHouseId, (error, rows, fields) => {
        console.log(rows);
        if (error) {
            res.status(400).json(error);
        } else if (rows.length == 0){
            res.status(404);
            res.json({
                "msg": "Requested house id not found!"
            })
        } else {
            res.status(200).json(rows);
        }
    });

});

module.exports = router;