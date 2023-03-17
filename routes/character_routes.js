module.exports = function(app, connection) {

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
            res.redirect('/ttrpg-area/login');
        }
    });
    
    app.post('/create_char', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.char_name) {
                connection.query('INSERT INTO characters (cha_name, cha_acc_id) VALUES (?, ?)', [req.body.char_name, req.session.userid], function(error, results, fields) {
                    if (error) throw error;
                    res.redirect('/ttrpg-area/charsheet_choose');
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
                        res.redirect('/ttrpg-area/error');
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
                        res.redirect('/ttrpg-area/error');
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

}