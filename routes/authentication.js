let express = require('express');
let router = express.Router();

router.get('/login', (req, res) => {
    res.status(200);
    // ToDo: Logica voor inloggen implementeren
});

router.get('/register', (req, res) => {
    res.status(200);
    // ToDo: Logica voor registreren implementeren.
});

router.get('*', (req, res) => {
    res.status(404);
    res.json({
        "msg": "Requested resource not found"
    })
});

module.exports = router;