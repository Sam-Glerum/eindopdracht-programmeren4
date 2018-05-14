let express = require('express');
let server = express();

let port = process.env.PORT || config.webPort;


// Login endpoint
server.get('/login', (req, res) => {
    res.status(200);
    // ToDo: Logica voor inloggen implementeren
});

// Registration endpoint
server.get('/register', (req, res) => {
    res.status(200);
    // ToDo: Logica voor registreren implementeren.
});



server.get('*', (req, res) => {
    res.status(404);
    res.json({
        "msg": "Requested resource not found"
    })
});
