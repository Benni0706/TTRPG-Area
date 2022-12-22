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
        connection.query('INSERT INTO accounts (acc_name,acc_mail,acc_password) VALUES (?,?,?)', [username, mail, password1], function (error, results, fields) {
            if (error) throw error;
            req.session.logged_in = true;
            req.session.username = username;
            res.redirect('/');
        });
    }
});

app.get('/logout', function (req, res) {
    req.session.logged_in = false;
    req.session.username = undefined;
    res.redirect('/');
});

app.get('/appointer', function (req, res) {
    if (req.session.logged_in && req.session.username) {
        connection.query('SELECT par_id, par_name, par_code FROM party, members, accounts WHERE par_id = mem_par_id AND mem_acc_id = acc_id AND acc_name = ?', [req.session.username], function (error, results, fields) {
            if (error) throw error;
            let length = results.length;
            res.render('pages/appointer', {
                logged_in: req.session.logged_in,
                username: req.session.username,
                parties: results
            });
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/get_dates', function (req, res) {
    if (req.session.logged_in && req.session.username) {
        connection.query('SELECT dat_date, dat_id, dat_description, dat_par_id FROM dates WHERE dat_par_id = ?', [req.body.par_id], function (error, results, fields) {
            if (error) throw error;
            res.render('partials/dates', {
                dates: results,
            });
        });
    }
});

app.post('/add_party', function(req, res) {
    if (req.session.logged_in && req.session.username) {
        let name = req.body.party_name;
        let code = req.body.party_code;
        if (req.body.party_name && req.body.party_code) {
            connection.query('INSERT INTO party (par_name,par_code) VALUES (?,?)', [name,code], function(error, results, fields) {
                if (error) throw error;
            });
            connection.query('SELECT par_id FROM party where par_name = ? AND par_code = ?', [name,code], function(error, results, fields) {
                if (error) throw error;
                var par_id = results[0].par_id;
                connection.query('SELECT acc_id FROM accounts WHERE acc_name = ?', [req.session.username], function(error, results, fields) {
                    if (error) throw error;
                    var acc_id = results[0].acc_id;
                    connection.query('INSERT INTO members (mem_acc_id,mem_par_id) VALUES (?,?)', [acc_id,par_id], function(error, results, fields) {
                        if (error) throw error;
                        res.redirect('/appointer');
                    });
                });
            });
        }
    }
    else {
        res.redirect('/login');
    }
});

app.get('/charsheet', function (req, res) {
    if (req.session.logged_in && req.session.username) {
        res.render('pages/charsheet', {
            logged_in: req.session.logged_in,
            username: req.session.username,
        });
    } else {
        res.redirect('/login');
    }
});

app.listen(8080);
console.log('server running on port 8080');