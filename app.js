/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), fs = require('fs');
var user = require('./routes/user');
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
		debug : false
	}));
	app.use(app.router);
	app.use(express.static(pub));
});
var appID
app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
	fbAppID = '364683150255491';
	fbSecret = '8efbb7529522c1d71549ddc7eff2a000';
	mongo = {
		"hostname" : "ds033477.mongolab.com",
		"port" : 33477,
		"username" : "heroku_app4649681",
		"password" : "4649681",
		"db" : "heroku_app4649681"
	}
});

app.configure('production', function() {
	app.use(express.errorHandler());
	fbAppID = '364683150255491';
	fbSecret = '8efbb7529522c1d71549ddc7eff2a000';
	mongo = {
		"hostname" : "ds033477.mongolab.com",
		"port" : 33477,
		"username" : "heroku_app4649681",
		"password" : "4649681",
		"db" : "heroku_app4649681"
	}
});


// Routes
app.get('/', routes.index);

app.get('/fb_authorize', user.fb_auth);

app.get('/fb_thanks', user.fb_thanks);

app.get('/user/save', user.save);

//Compressed JS
app.get('/scripts.js', function(req, res) {
	get_js(false, function(js) {

		res.contentType('text/js');
		res.end(js);
	});
});
var get_js = function(compress, callback) {
	//load reqs
	var path = require('path');
	var base = pub + '/app/javascripts';
	var minpath = base + '/scripts.min.js';

	if(compress) {
		fs.unlinkSync(minpath);
	}

	if(path.existsSync(minpath)) {
		var js = '';
		js = fs.readFileSync(minpath);
		if( typeof callback == 'function') {
			callback(js);
		}
	} else {
		var js = '';
		fs.readdir(base, function(err, files) {
			files.forEach(function(file) {
				if(file != 'scripts.min.js') {
					js += fs.readFileSync(base + '/' + file);
				}
			});
			if(compress) {
				var jsp = require("uglify-js").parser;
				var pro = require("uglify-js").uglify;
				console.log('compressing');
				js = jsp.parse(js);
				js = pro.ast_mangle(js);
				js = pro.ast_squeeze(js);
				js = pro.gen_code(js);
				fs.writeFile(minpath, js);
			}
			if( typeof callback == 'function') {
				callback(js);
			}
		});
	}

}
get_js(false);
//Start Listening
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Listening on " + port);
});
