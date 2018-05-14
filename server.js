let express = require('express');
let server = express();

let port = process.env.PORT || config.webPort;

/* Login and Registration */

// Login endpoint
server.post('/login', (req, res) => {
    let loginInfo = req.body;
    let query = {
        sql: ""
    }

    res.status(200);
    // ToDo: Logica voor inloggen implementeren
});

// Registration endpoint
server.post('/register', (req, res) => {
    res.status(200);
    // ToDo: Logica voor registreren implementeren.
});

/* StudentHouse endpoints */





server.get('*', (req, res) => {
    res.status(404);
    res.json({
        "msg": "Requested resource not found"
    })
});
