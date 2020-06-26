"use strict";

var express = require('express');

var app = express();

var cors = require("cors"); //for cross platform


var bodyParser = require('body-parser');

var path = require('path');

require('dotenv').config();

var compression = require("compression");

var fileUpload = require('express-fileupload');

var cookieParser = require('cookie-parser');

var session = require('express-session');

var _require = require('./middleware/AdminAuth'),
    signIn = _require.signIn,
    welcome = _require.welcome,
    logout = _require.logout; // const hostname = process.env.HOSTNAME;


var port = process.env.PORT;

var conf = require('./config'); //for compress responses


app.use(compression()); //Session setup

app.use(cookieParser());
app.use(session({
  secret: "Shh, its a secret!",
  saveUninitialized: true,
  resave: true
})); //for enable cors

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');
app.use(express["static"]('./public')); //All Admin Router
//Register Router

var registerRouter = require('./routes/AdminRoute/RegisterRoute'); //Offer Router


var offerRouter = require('./routes/AdminRoute/OfferRoute'); //Category Router


var categoryRouter = require('./routes/AdminRoute/CategoryRoute'); //Area Router


var areaRouter = require('./routes/AdminRoute/AreaRoute'); //Warranty Router


var warrantyRouter = require('./routes/AdminRoute/WarrantyRoute'); //Common Router


var commonRouter = require('./routes/CommonRouter');

app.get('/', function (req, res) {
  res.render('login');
});
app.get('/login', function (req, res) {
  res.render('login');
}); //logout

app.get('/logout', logout); //Authentication Route

app.post('/auth/login', signIn);
app.get('/auth/login', function (req, res) {
  res.render('index');
});
app.use(['/register', '/customer', '/installer'], welcome, registerRouter); //Customer & Installer Registration
// app.use('/registration', welcome, registerRouter);
//Offer Route

app.use('/offer', welcome, offerRouter); //Category Route

app.use('/category', welcome, categoryRouter); //Area Route

app.use('/area', welcome, areaRouter); //Warranty Route

app.use('/warranty', welcome, warrantyRouter);
app.use('/common', commonRouter);
app.listen(port, function () {
  console.log("Server is running on https://localhost:".concat(port, "/"));
});