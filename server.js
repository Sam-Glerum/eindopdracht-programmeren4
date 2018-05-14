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
server.post('/api/login', (req, res) => {
    let loginInfo = req.body;

    res.status(200);
    // ToDo: Logica voor inloggen implementeren
});

//Registration endpoint
server.post('/api/register', (req, res, next) => {
    let user = req.body;
    console.log(user);
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

/* StudentHouse endpoints */
server.post('/api/studentenhuis', (req, res) => {
    res.status(200);
    //Todo Logica
});

// Get all studenthouses
server.get('/api/studentenhuis', (req, res) => {
    res.contentType('application/json');

    db.query('SELECT * FROM studentenhuis', (error, rows, fields) => {
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(rows);
        }
    })
});

// Get a single studenthouse corresponding to the supplied ID











server.get('*', (req, res) => {
    res.status(404);
    res.json({
        "msg": "Requested resource not found"
    })
});

server.listen(port, () => {
    console.log("Server is listening on port " + port);
})