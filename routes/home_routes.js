module.exports = function(app, connection) {

    app.get('/', function (req, res) {
        res.render('./pages/home', {
            logged_in: req.session.logged_in,
            username: req.session.username,
        });
    
    });
    
    app.get('/error', function (req, res) {
        res.send('Es ist ein Fehler aufgetreten');
    });

}