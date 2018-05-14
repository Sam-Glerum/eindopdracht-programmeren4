let express = require('express');
let server = express();
let config = require('./config/config');
let db = require('./config/db');

let port = process.env.PORT || config.webPort;

/* Login and Registration */

// Login endpoint
server.post('/api/login', (req, res) => {
    let loginInfo = req.body;

    res.status(200);
    // ToDo: Logica voor inloggen implementeren
});

// Registration endpoint
// server.post('/api/register', (req, res) => {
//     let user = req.body;
//     let firstname = user.firstname;
//     let query = {
//         sql: 'INSERT INTO `user` (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)',
//         values: [firstname, user.lastname, user.email, user.password],
//         timeout: 2000
//     };
//     console.dir(user);
//     console.log('User query: ' + query.sql);
//
//     res.contentType('application/json');
//     db.query(query, (error, rows, fields) => {
//         if (error) {
//             res.status(400);
//             res.json(error);
//         } else {
//             res.status(200);
//             res.json(rows);
//         }
//     });
// });

/* StudentHouse endpoints */
server.post('/api/studentenhuis', (req, res) => {
    res.status(200);
    //Todo Logica
});

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










server.get('*', (req, res) => {
    res.status(404);
    res.json({
        "msg": "Requested resource not found"
    })
});

server.listen(port, () => {
    console.log("Server is listening on port " + port);
})