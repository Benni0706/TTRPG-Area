module.exports = function(app, connection) {

    app.post('/get_spellslots', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('SELECT * FROM spellslots WHERE sps_cha_id = ? ORDER BY sps_level, sps_state DESC', [req.body.cha_id], function(error, results, fields) {
                            if (error) throw error;
                            res.render('partials/spellslots', {
                                spellslots: results,
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

    app.post('/add_spellslot', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id && req.body.level) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('INSERT INTO spellslots (sps_cha_id, sps_level) VALUES (?, ?)', [req.body.cha_id, req.body.level], function(error, results, fields) {
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

    app.post('/change_spellslot_attribute', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        let sql = "UPDATE spellslots SET " + req.body.attribute + " = ? WHERE sps_id = ?"
                        connection.query(sql, [req.body.value, req.body.sps_id], function(error, results, fields) {
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

    app.post('/delete_spellslot', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query("DELETE FROM spellslots WHERE sps_cha_id = ? AND sps_level = ? ORDER BY sps_state LIMIT 1", [req.body.cha_id, req.body.sps_level], function(error, results, fields) {
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