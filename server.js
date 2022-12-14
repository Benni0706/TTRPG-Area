const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const path = require("path");
const favicon = require('serve-favicon');
const { request } = require('http');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'benni',
    password: 'MCBsql2003+',
    database: 'website'
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public', 'scripts')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(session({
    secret: 'bennissecret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('pages/home', {
        logged_in: req.session.logged_in,
        username: req.session.username,
    });

});

app.get('/login', function (req, res) {
    res.render('pages/login', {
        username: req.session.username,
    });
});

app.post('/login', function (req, res) {
    let username = req.body.login_name;
    let password = req.body.login_password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE acc_name=? AND acc_password=?', [username, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length == 1) {
                req.session.logged_in = true;
                req.session.username = username;
                res.redirect('/');
            } else {
                req.session.username = username;
                res.redirect('/login');
            }
            res.end;
        });
    } else {
        req.session.username = username;
        res.redirect('/login');
    }
});

app.get('/create_acc', function (req, res) {
    res.render('pages/create_acc');
});

app.post('/create_acc', function (req, res) {
    let username = req.body.create_acc_name;
    let mail = req.body.create_acc_mail;
    let password1 = req.body.create_acc_password;
    let password2 = req.body.create_acc_password_2;
    if (username && mail && password1 && password1 == password2) {
        connection.query('INSERT INTO accounts (acc_name,acc_mail,acc_password) values (?,?,?)', [username,mail,password1], function(error, results, fields) {
            if (error) throw error;
            req.session.logged_in = true;
            req.session.username = username;
            res.redirect('/');
        });
    }
});

app.get('/logout', function(req, res) {
    req.session.logged_in = false;
    req.session.username = undefined;
    res.redirect('/');
});

app.get('/dnd', function (req, res) {
    if (req.session.logged_in && req.session.username) {
        res.render('pages/dnd');
    } else {
        res.redirect('/login');
    }
    
});

app.listen(8080);
console.log('server running on port 8080');