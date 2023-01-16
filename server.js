const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const path = require("path");
const favicon = require('serve-favicon');
const { request } = require('http');
const { render } = require('ejs');
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
                req.session.username = results[0].acc_name;
                req.session.userid = results[0].acc_id;
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
            res.redirect('/login');
        });
    }
});

app.get('/logout', function (req, res) {
    req.session.logged_in = false;
    req.session.username = undefined;
    req.session.userid = undefined;
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
                parties: results,
            });
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/appointer', function (req, res) {
    if (req.session.logged_in && req.session.username) {
        connection.query('SELECT dat_date, dat_description, dat_id, com_status FROM dates LEFT JOIN commitments ON dat_id = com_dat_id AND com_acc_id = ? WHERE dat_par_id = ?', [req.session.userid, req.body.par_id], function (error, results, fields) {
            if (error) throw error;
            get_commitments(results, req, res);
        });
    } else {
        res.redirect('/login');
    }
});

function get_commitments (dates, req, res) {
    connection.query("SELECT com_dat_id, com_acc_id, com_status, acc_name FROM commitments, dates, accounts WHERE com_dat_id = dat_id AND com_acc_id = acc_id AND dat_par_id = ? ORDER BY FIELD(com_status, 'zusage', 'unsicher', 'absage')", [req.body.par_id], function (error, results, fields) {
        if (error) throw error;
        for (var i = 0; i < results.length; i++) {
            for (var k = 0; k < dates.length; k++) {
                if (dates[k].dat_id == results[i].com_dat_id) {
                    if (typeof(dates[k].commitments) == "undefined") {
                        dates[k].commitments = [];
                    }
                    dates[k].commitments.push(results[i]);
                }
            }
        }
        res.render('partials/dates', {
            dates: dates,
        });
    });
}

app.post('/commit', function (req, res) {
    if (req.session.logged_in && req.session.username) {
        connection.query('SELECT count(*) FROM commitments WHERE com_acc_id = ? AND com_dat_id = ?', [req.session.userid, req.body.dat_id], function (error, results, fields) {
            if (error) throw error;
            if (results[0]['count(*)'] == 0) {
                connection.query('INSERT INTO commitments (com_acc_id, com_dat_id, com_status) VALUES (?, ?, ?)', [req.session.userid, req.body.dat_id, req.body.status], function (error, results, fields) {
                    if (error) throw error;
                    res.end();
                });
            } else {
                connection.query('UPDATE commitments SET com_status = ? WHERE com_acc_id = ? AND com_dat_id = ?', [req.body.status, req.session.userid, req.body.dat_id], function (error, results, fields) {
                    if (error) throw error;
                    res.end();
                });
            }
        });
    } else {
        res.send('user not logged in');
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
                connection.query('INSERT INTO members (mem_acc_id,mem_par_id) VALUES (?,?)', [req.session.userid,par_id], function(error, results, fields) {
                    if (error) throw error;
                    res.redirect('/appointer');
                });
            });
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.post('/join_party', function(req, res) {
    if (req.session.logged_in && req.session.username) {
        if (req.body.party_code_join && req.body.party_name_join) {
            connection.query('SELECT par_id FROM party WHERE par_code = ? AND par_name = ?', [req.body.party_code_join,req.body.party_name_join], function(error, results, fields) {
                if (error) throw error;
                let par_id = results[0].par_id;
                connection.query('INSERT INTO members (mem_acc_id,mem_par_id) VALUES (?,?)', [req.session.userid,par_id], function(error, results, fields) {
                    if (error) throw error;
                    res.redirect('/appointer');
                });
            });
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.post('/leave_party', function(req, res) {
    if (req.session.logged_in && req.session.username) {
        if (req.body.partyid) {
            connection.query('DELETE FROM members WHERE mem_acc_id = ? AND mem_par_id = ?', [req.session.userid,req.body.partyid], function(error, results, fields) {
                if (error) throw error;
                res.redirect('/appointer');
                connection.query('SELECT COUNT(*) FROM members WHERE mem_par_id = ?', [req.body.partyid], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0]['COUNT(*)'] == 0) {
                        connection.query('DELETE FROM party WHERE par_id = ?', [req.body.partyid], function(error, results, fields) {
                            if (error) throw error;
                        });
                    }
                });
            });
        } else {
            res.redirect("/error");
        } 
    }
    else {
        res.send('user not logged in');
    }
});

app.post('/add_date', function(req, res) {
    if (req.session.logged_in && req.session.username) {
        if (req.body.dat_date && req.body.dat_description && req.body.par_id) {
            connection.query('INSERT INTO dates (dat_date, dat_description, dat_par_id) VALUES (?, ?, ?)', [req.body.dat_date, req.body.dat_description, req.body.par_id], function(error, results, fields) {
                if (error) throw error;
                res.end();
            });
        } else {
            res.end();
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.get('/error', function (req, res) {
    res.send('Es ist ein Fehler aufgetreten');
});

app.get('/charsheet_choose', function (req, res) {
    if (req.session.logged_in && req.session.username && req.session.userid) {
        connection.query('SELECT cha_id, cha_name FROM characters WHERE cha_acc_id = ?', [req.session.userid], function(error, results, fields) {
            if (error) throw error;
            res.render('pages/char_sheet_choose', {
                logged_in: req.session.logged_in,
                username: req.session.username,
                characters: results,
            });
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/create_char', function(req, res) {
    if (req.session.logged_in && req.session.username && req.session.userid) {
        if (req.body.char_name) {
            connection.query('INSERT INTO characters (cha_name, cha_acc_id) VALUES (?, ?)', [req.body.char_name, req.session.userid], function(error, results, fields) {
                if (error) throw error;
                res.redirect('/charsheet_choose');
            });
        } else {
            res.end();
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.post('/charsheet_main', function(req, res) {
    if (req.session.logged_in && req.session.username && req.session.userid) {
        if (req.body.cha_id) {
            connection.query('SELECT * FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                if (error) throw error;
                if (results[0].cha_acc_id == req.session.userid) {
                    res.render('pages/char_sheet_main', {
                        logged_in: req.session.logged_in,
                        username: req.session.username,
                        character: results[0],
                    });
                } else {
                    res.redirect('/error');
                }
            });
        } else {
            res.end();
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.post('/get_spells', function(req, res) {
    if (req.session.logged_in && req.session.username && req.session.userid) {
        if (req.body.cha_id) {
            connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                if (error) throw error;
                if (results[0].cha_acc_id == req.session.userid) {
                    connection.query('SELECT * FROM spells WHERE spe_cha_id = ? ORDER BY spe_level', [req.body.cha_id], function(error, results, fields) {
                        if (error) throw error;
                        res.render('partials/spells', {
                            spells: results,
                        });
                    });
                } else {
                    res.redirect('/error');
                }
            });
        } else {
            res.end();
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.post('/add_spell', function(req, res) {
    if (req.session.logged_in && req.session.username && req.session.userid) {
        if (req.body.cha_id) {
            connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                if (error) throw error;
                if (results[0].cha_acc_id == req.session.userid) {
                    connection.query('INSERT INTO spells (spe_cha_id) VALUES (?)', [req.body.cha_id], function(error, results, fields) {
                        if (error) throw error;
                        res.end();
                    });
                } else {
                    res.redirect('/error');
                }
            });
        } else {
            res.end();
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.post('/change_attribute', function(req, res) {
    if (req.session.logged_in && req.session.username && req.session.userid) {
        if (req.body.cha_id) {
            connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                if (error) throw error;
                if (results[0].cha_acc_id == req.session.userid) {
                    let sql = "UPDATE characters SET " + req.body.attribute + " = ? WHERE cha_id = ?"
                    connection.query(sql, [req.body.value, req.body.cha_id], function(error, results, fields) {
                        if (error) throw error;
                        res.end();
                    });
                } else {
                    res.redirect('/error');
                }
            });
        } else {
            res.end();
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.post('/change_spell_attribute', function(req, res) {
    if (req.session.logged_in && req.session.username && req.session.userid) {
        if (req.body.cha_id) {
            connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                if (error) throw error;
                if (results[0].cha_acc_id == req.session.userid) {
                    let sql = "UPDATE spells SET " + req.body.attribute + " = ? WHERE spe_id = ?"
                    connection.query(sql, [req.body.value, req.body.spe_id], function(error, results, fields) {
                        if (error) throw error;
                        res.end();
                    });
                } else {
                    res.redirect('/error');
                }
            });
        } else {
            res.end();
        }
    }
    else {
        res.send('user not logged in');
    }
});

app.listen(8080);
console.log('server running on port 8080');