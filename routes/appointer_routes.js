module.exports = function(app, connection) {

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
            res.redirect('/ttrpg-area/login');
        }
    });
    
    app.post('/appointer', function (req, res) {
        if (req.session.logged_in && req.session.username) {
            connection.query('SELECT dat_date, dat_description, dat_id, com_status FROM dates LEFT JOIN commitments ON dat_id = com_dat_id AND com_acc_id = ? WHERE dat_par_id = ?', [req.session.userid, req.body.par_id], function (error, results, fields) {
                if (error) throw error;
                get_commitments(results, req, res);
            });
        } else {
            res.redirect('/ttrpg-area/login');
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
                        res.redirect('/ttrpg-area/appointer');
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
                        res.redirect('/ttrpg-area/appointer');
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
                    res.redirect('/ttrpg-area/appointer');
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
                res.redirect("/ttrpg-area/error");
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

}