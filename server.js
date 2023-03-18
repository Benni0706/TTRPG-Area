const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const path = require("path");
const favicon = require('serve-favicon');
const { request } = require('http');
const { render } = require('ejs');
const glob = require('glob');
const fs = require('fs');

let config;
try {
    config = fs.readFileSync('./config.txt', 'utf8').split(',');
    console.log('daten:' + config);
} catch (err) {
    console.error(err);
}

const path_routes = config[0];
const hostname = config[1];
const port = config[2];
const connection = mysql.createConnection({
    host: config[3],
    user: config[4],
    password: config[5],
    database: config[6]
});

app.set('view engine', 'ejs');
app.use('/ttrpg-area', express.static(path.join(__dirname, 'public', 'dist')));
app.use('/ttrpg-area', express.static(path.join(__dirname, 'public', 'scripts')));
app.use('/ttrpg-area', express.static(path.join(__dirname, 'public', 'images')));
app.use('/ttrpg-area', favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(session({
    secret: 'bennissecret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname + '/views'));

const router = express.Router();

glob.sync(path_routes).forEach( function(file) {
    require(path.resolve(file))(router, connection);
});

app.use('/ttrpg-area', router);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
