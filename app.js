var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser')
var cors = require('cors');
require('dotenv').config();

require("./models/Wine");
require("./models/PointSchema");
require("./models/Winery");
require("./models/Region");
require("./models/Booking");

var url = process.env.MONGO_URL + process.env.MONGO_DB;
var mongoose = require("mongoose");
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

var indexController = require('./controllers/index');
var userController = require('./controllers/users');
var wineryController = require('./controllers/winery');
var wineController = require('./controllers/wine');
var regionController = require('./controllers/region');
var bookingController = require('./controllers/booking');
var app = express();


// view engine setup
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', indexController);
app.use('/user', userController);
app.use('/winery', wineryController);
app.use('/wine', wineController);
app.use('/region', regionController);
app.use('/booking', bookingController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Request logger
app.use(function(error, req, res, next) {
    console.info("received from " + req.get("X-Forwarded-For") + " : " + req.method + " " + req.originalUrl + " (Authorization: " + req.get("Authorization") + ")");
    if (error /*instanceof SyntaxError*/ ) {
        res.status(400);
        console.error(error);
        res.json({ error: { msg: error.message } });
    } else {
        next();
    }
});

module.exports = app;