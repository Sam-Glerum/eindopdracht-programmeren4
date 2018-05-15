let express = require('express');
let server = express();
let config = require('./config/config');
let bodyparser = require('body-parser');
let db = require('./config/db');

let port = process.env.PORT || config.webPort;

server.use(bodyparser.urlencoded({
    extended: true
}));

server.use('/api', require('./routes/auth_routes'));
server.use('/api', require('./routes/studenthouse_routes'));
server.use('/api', require('./routes/meal_routes'));

server.get('*', (req, res) => {
    res.status(404);
    res.json({
        "msg": "Requested resource not found"
    })
});

server.listen(port, () => {
    console.log("Server is listening on port " + port);
});