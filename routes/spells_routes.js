module.exports = function(app, connection) {

    app.post('/get_spells', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('SELECT * FROM spells WHERE spe_cha_id = ? ORDER BY spe_level, spe_prepared', [req.body.cha_id], function(error, results, fields) {
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

    app.post('/delete_spell', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query("DELETE FROM spells WHERE spe_id = ?", [req.body.spe_id], function(error, results, fields) {
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