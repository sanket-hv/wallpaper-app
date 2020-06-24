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

var _require = require('./middleware/AdminAuth'),
    isAuthenticated = _require.isAuthenticated; // const hostname = process.env.HOSTNAME;


var port = process.env.PORT;

var conf = require('./config'); //for compress responses


app.use(compression()); //for enable cors

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');
app.use(express["static"]('./public')); //All Admin Router
//Login Router

var authRouter = require('./routes/AuthenticateRoute'); //Offer Router


var offerRouter = require('./routes/AdminRoute/OfferRoute'); //Category Router


var categoryRouter = require('./routes/AdminRoute/CategoryRoute'); //Area Router


var areaRouter = require('./routes/AdminRoute/AreaRoute');

app.get('/', isAuthenticated, function (req, res) {
  res.render('layout');
});
app.get('/login', function (req, res) {
  res.render('login');
}); //Offer Route

app.use('/offer', isAuthenticated, offerRouter); //Category Route

app.use('/category', isAuthenticated, categoryRouter); //Area Route

app.use('/area', isAuthenticated, areaRouter);
app.use('/auth', authRouter);
app.listen(port, function () {
  console.log("Server is running on https://localhost:".concat(port, "/"));
});