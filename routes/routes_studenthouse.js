const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/studentenhuis', (req, res) => {
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

router.post('studentenhuis', (req, res) => {
    res.status(200);
    //Todo Logica
});

module.exports = router;