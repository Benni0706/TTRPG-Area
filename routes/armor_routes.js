module.exports = function(app, connection) {

    app.post('/get_armor', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('SELECT * FROM armor, characters WHERE arm_cha_id = ? AND arm_cha_id = cha_id ORDER BY arm_rk', [req.body.cha_id], function(error, results, fields) {
                            if (error) throw error;
                            res.render('partials/armor', {
                                armor: results,
                            });
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

    app.post('/add_armor', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('INSERT INTO armor (arm_cha_id) VALUES (?)', [req.body.cha_id], function(error, results, fields) {
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

    app.post('/change_armor_attribute', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        let sql = "UPDATE armor SET " + req.body.attribute + " = ? WHERE arm_id = ?"
                        connection.query(sql, [req.body.value, req.body.arm_id], function(error, results, fields) {
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

    app.post('/delete_armor', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query("DELETE FROM armor WHERE arm_id = ?", [req.body.arm_id], function(error, results, fields) {
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