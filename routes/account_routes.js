module.exports = function(app, connection) {

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
                    res.redirect('/ttrpg-area');
                } else {
                    req.session.username = username;
                    res.redirect('/ttrpg-area/login');
                }
                res.end;
            });
        } else {
            req.session.username = username;
            res.redirect('/ttrpg-area/login');
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
                res.redirect('/ttrpg-area/login');
            });
        }
    });
    
    app.get('/logout', function (req, res) {
        req.session.logged_in = false;
        req.session.username = undefined;
        req.session.userid = undefined;
        res.redirect('/ttrpg-area');
    });

}