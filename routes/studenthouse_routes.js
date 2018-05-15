const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../auth/authentication');
const authController = require('../auth/auth_controller');
const bodyparser = require('body-parser');

router.use(bodyparser.urlencoded({
    extended: true
}));

router.all('/studentenhuis', authController.validateToken, (req, res, next) => {
    next();
});

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

router.post('/studentenhuis', (req, res, next) => {
    let studentenhuis = req.body;
    let token = req.token;
    let user = req.id;
    let query = {
        sql: 'INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (?, ?, ?)',
        values: [studentenhuis.naam, studentenhuis.adres, user],
        timeout: 2000
    };
    console.log('Studenthuis query: ' + query.sql);

    res.contentType('application/json');
    db.query(query, (error, rows, fields) => {
        if (error) {
            res.status(400);
            res.json(error);
        } else {
            res.status(200);
            res.json(rows);
        }
    });
});

router.post('studentenhuis', (req, res) => {
    res.status(200);
    //Todo Logica
});

module.exports = router;