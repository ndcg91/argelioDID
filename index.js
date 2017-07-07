var express = require("express");
var	app = express();
var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1:27017/did');
var auth = require("./helpers/auth.js");

var routes = require("./routes/index"),
  	views = require("./routes/views/index")
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	exphbs  = require('express-handlebars'),
	path = require("path"),
  	ari = require("./helpers/ari"),
  	did = require("./helpers/did")

did.checker()


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(auth.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({extname:'html', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use('/', views);
app.use('/api', routes);

app.listen(3000, function () {
  console.log('app listening on port 3000!');
  ari.initializeAri()
});
