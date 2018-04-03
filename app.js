const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config/index');
const webhook = require('./main/webhook');

const app = express();

app.listen(config.port)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/webhook', webhook);

module.exports = app;
