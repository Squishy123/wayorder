const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//get env vars
require('dotenv').config();

//create server
let server = express();

server.use(bodyParser.json());

server.use(
    bodyParser.urlencoded({
        extended: true
    })
);

(async function() {
    server.listen(3000, function() {
        console.log(`${server.name} listening at http://localhost:3000`);
    });
})();