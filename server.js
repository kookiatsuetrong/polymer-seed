"use strict";
var PORT		= 4000;
var express		= require('express');
var path		= require('path');
var cookie		= require('cookie-parser');
var bodyParser	= require('body-parser');
var less		= require('less-middleware');
var session		= require('express-session');
var routes		= require('./routes/index');
var multer		= require('multer');
var app			= express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookie());

app.set('trust proxy', 1);
app.use(session({
	secret: 'secr3t',
	cookie: { maxAge: 60000 * 60 * 60 * 24 /*, secure: true */ },
	saveUninitialized: true,
	resave: true
}));

app.use(less(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({ dest: './uploads'}));
app.engine('html', require('ejs').renderFile);
app.use('/', routes);

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error.html', {
		message: err.message
	});
});

var http		= require('http').Server(app);
var io			= require('socket.io')(http);
io.on('connection', function(socket){
	console.log('a user connected');
	console.log(socket);
});

var server = http.listen(PORT, function() {
	console.log('Server port ' + server.address().port);
});

/*
var fs = require('fs');
var https = require('https');
var options = {
	key:  fs.readFileSync('/path/url.key'),
	cert: fs.readFileSync('/path/url.crt')
};

var sslServer = https.createServer(options, app).listen(PORT + 1, function(){
	console.log("SSL port " + (PORT + 1));
});
*/
