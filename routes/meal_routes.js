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

module.exports = router;