
'use strict';

/****************************** Variables ******************************/

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var RedisStore = require('connect-redis')(session);
// var flash = require('express-flash');
var mongoose = require('mongoose');
var passport = require('passport');
const MongoStore = require('connect-mongo')(session);


/****************************** Mongo DB  ******************************/
var db_username = require("./config.json").MONGO_DATABASE_USERNAME;
var db_password = require("./config.json").MONGO_DATABASE_PASSWORD;
var db_url = require("./config.json").MONGO_DATABASE_URL;
var connection_string = "mongodb://" + db_username + ":" + db_password + db_url;
mongoose.connect(connection_string);
//mongoose.connect('mongodb://localhost/DBNAME');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error: '));
db.once('open', function () {
    console.log('DB connection success! ');
});

/****************************** app Express config  ******************************/
var app = express();
app.use(cookieParser(require("./config.json").APP_SECRET_KEY, {maxAge: 60 * 60 * 1000 * 24}));
app.use(session({
    secret: require("./config.json").APP_SECRET_KEY,
    name: 'KhangPQ',
    store: new RedisStore({
        host: require("./config.json").REDIS_HOST,
        port: require("./config.json").REDIS_PORT
    }),
    cookie: {
        maxAge: 60 * 60 * 1000 * 24//1 day
    },
    // store: new MongoStore({mongooseConnection: mongoose.connection, clear_interval: 3600}),// Store session
    proxy: true,
    resave: true,
    saveUninitialized: true,
}));


app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
// app.use('/admin',authService.hasRole("manager"),express.static(__dirname + "/views/admin"));
app.use('/', express.static(__dirname + "/views"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./routes')(app);

/******************************   ******************************/

/******************************  CONFIG HTTP SERVER  ******************************/

var server = http.createServer(app).listen(
    (process.env.PORT || require("./config.json").SERVER_PORT),
    function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log("Example app listening at http://%s:%s", host, port);
    }
);