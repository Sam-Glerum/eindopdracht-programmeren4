const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* Login and Registration */

// Login endpoint
router.post('/api/login', (req, res, next) => {
    let loginParameters = req.body;


    let query = {
        sql: 'SELECT Email, Password FROM user',
    };


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

//Registration endpoint
router.post('/register', (req, res, next) => {
    let user = req.body;
    let query = {
        sql: 'INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)',
        values: [user.firstname, user.lastname, user.email, user.password],
        timeout: 2000
    };
    console.log('User query: ' + query.sql);

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

module.exports = router;