const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const path = require("path");
const favicon = require('serve-favicon');
const { request } = require('http');
const { render } = require('ejs');
const glob = require('glob');
const hostname = 'localhost';
const port = 3000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'benni',
    password: 'MCBsql2003+',
    database: 'website'
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

app.configure(function() {
    app.set('views', path.join(__dirname + '/views'));
});

glob.sync('./routes/*.js').forEach( function(file) {
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
