module.exports = function(app, connection) {

    app.post('/get_weapons', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('SELECT * FROM weapons, characters WHERE wea_cha_id = ? AND wea_cha_id = cha_id ORDER BY wea_bonus', [req.body.cha_id], function(error, results, fields) {
                            if (error) throw error;
                            res.render('partials/weapons', {
                                weapons: results,
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

    app.post('/add_weapon', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('INSERT INTO weapons (wea_cha_id) VALUES (?)', [req.body.cha_id], function(error, results, fields) {
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

    app.post('/change_weapon_attribute', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        let sql = "UPDATE weapons SET " + req.body.attribute + " = ? WHERE wea_id = ?"
                        connection.query(sql, [req.body.value, req.body.wea_id], function(error, results, fields) {
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

    app.post('/delete_weapon', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query("DELETE FROM weapons WHERE wea_id = ?", [req.body.wea_id], function(error, results, fields) {
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

}