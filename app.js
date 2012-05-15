/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes');

var lessMiddleware = require('less-middleware');

var pub = __dirname + '/public';

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret : 'alsdkjaslkdjaslkdjaslkd'
	}));
	app.use(lessMiddleware({
		src : pub,
		compress : true,
		debug: false
	}));
	app.use(app.router);
	app.use(express.static(pub));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});
// Routes

app.get('/', routes.index);

//Start Listening
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});