var express = require('express');
var app = express();
const path = require("path");

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', function(req, res) {
    res.render('pages/home');
});

app.get('/dnd', function(req, res) {
    res.render('pages/dnd');
});

app.listen(8080);
console.log('server running on port 8080');