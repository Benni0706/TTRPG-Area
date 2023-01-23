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
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public', 'scripts')));
app.use(express.static(path.join(__dirname, 'public', 'images')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(session({
    secret: 'bennissecret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname + '/views'));

console.log(path.join(__dirname, 'routes/*.js'));
glob.sync(path_routes).forEach( function(file) {
    require(path.resolve(file))(app, connection);
});

app.get('/', function (req, res) {
    res.render('./pages/home', {
        logged_in: req.session.logged_in,
        username: req.session.username,
    });

});

app.get('/error', function (req, res) {
    res.send('Es ist ein Fehler aufgetreten');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
