module.exports = function(app, connection) {

    app.post('/get_talents', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('SELECT * FROM talents, characters WHERE tal_cha_id = ? AND tal_cha_id = cha_id ORDER BY tal_name', [req.body.cha_id], function(error, results, fields) {
                            if (error) throw error;
                            res.render('partials/talents', {
                                talents: results,
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

    app.post('/add_talent', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query('INSERT INTO talents (tal_cha_id) VALUES (?)', [req.body.cha_id], function(error, results, fields) {
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

    app.post('/change_talent_attribute', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        let sql = "UPDATE talents SET " + req.body.attribute + " = ? WHERE tal_id = ?"
                        connection.query(sql, [req.body.value, req.body.tal_id], function(error, results, fields) {
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

    app.post('/delete_talent', function(req, res) {
        if (req.session.logged_in && req.session.username && req.session.userid) {
            if (req.body.cha_id) {
                connection.query('SELECT cha_acc_id FROM characters WHERE cha_id = ?', [req.body.cha_id], function(error, results, fields) {
                    if (error) throw error;
                    if (results[0].cha_acc_id == req.session.userid) {
                        connection.query("DELETE FROM talents WHERE tal_id = ?", [req.body.tal_id], function(error, results, fields) {
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