const express = require('express')
const app = express();
const cors = require("cors"); //for cross platform
const bodyParser = require('body-parser');
const path = require('path')
require('dotenv').config();
var compression = require("compression");
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { signIn, welcome, logout } = require('./middleware/AdminAuth')


// const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const conf = require('./config')
//for compress responses
app.use(compression());

//Session setup
app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    saveUninitialized: true,
    resave: true
}));

//for enable cors
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

app.use(express.static('./public'));

//All Admin Router

//Register Router
const registerRouter = require('./routes/AdminRoute/RegisterRoute');
//Offer Router
const offerRouter = require('./routes/AdminRoute/OfferRoute');
//Catalogue Router
const catalogueRouter = require('./routes/AdminRoute/CatalogueRoute');
//Order Router
const orderRouter = require('./routes/AdminRoute/OrderRoute');
//Category Router
const categoryRouter = require('./routes/AdminRoute/CategoryRoute');
//Area Router
const areaRouter = require('./routes/AdminRoute/AreaRoute');
//Warranty Router
const warrantyRouter = require('./routes/AdminRoute/WarrantyRoute');
//Common Router
const commonRouter = require('./routes/CommonRouter');

app.get('/', (req, res) => {
    res.render('login')
})

app.get('/login', (req, res) => {
    res.render('login');
})

//logout
app.get('/logout', logout);
//Authentication Route
app.post('/auth/login', signIn);

app.get('/auth/login', (req, res) => {
    res.render('index');
});

//Customer & Installer Registration
app.use(['/register', '/customer', '/installer'], welcome, registerRouter);
//Catalogue Route
app.use('/catalogue', welcome, catalogueRouter);
//Catalogue Route
app.use('/order', welcome, orderRouter);
//Offer Route
app.use('/offer', welcome, offerRouter);
//Category Route
app.use('/category', welcome, categoryRouter);
//Area Route
app.use('/area', welcome, areaRouter);
//Warranty Route
app.use('/warranty', welcome, warrantyRouter);

app.use('/common', commonRouter);

app.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}/`);
})