let express = require('express');
let server = express();
let config = require('./config/config');
let bodyparser = require('body-parser');
let db = require('./config/db');

let port = process.env.PORT || config.webPort;

server.use(bodyparser.urlencoded({
    extended: true
}));
//
// server.use(bodyparser.json());

/* Login and Registration */

// Login endpoint
server.post('/api/login', (req, res, next) => {
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
server.post('/api/register', (req, res, next) => {
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

server.get('*', (req, res) => {
    res.status(404);
    res.json({
        "msg": "Requested resource not found"
    })
});

server.listen(port, () => {
    console.log("Server is listening on port " + port);
});