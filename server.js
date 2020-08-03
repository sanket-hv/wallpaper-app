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

//API Router
const API_Router = require('./routes/AppRoute/V1_API');

//All Admin Router
//Dashboard Router
const dashboardRouter = require('./routes/AdminRoute/DashboardRoute');
//Register Router
const registerRouter = require('./routes/AdminRoute/RegisterRoute');
//Offer Router
const offerRouter = require('./routes/AdminRoute/OfferRoute');
//Inquiry Router
const inquiryRouter = require('./routes/AdminRoute/InquiryRoute');
//Catalogue Router
const catalogueRouter = require('./routes/AdminRoute/CatalogueRoute');
//Order Router
const orderRouter = require('./routes/AdminRoute/OrderRoute');
//Complaint Router
const complaintRouter = require('./routes/AdminRoute/ComplaintRoute');
//New Job Router
const newjobRouter = require('./routes/AdminRoute/NewjobRoute');
//Category Router
const categoryRouter = require('./routes/AdminRoute/CategoryRoute');
//Area Router
const areaRouter = require('./routes/AdminRoute/AreaRoute');
//Gallery Router
const galleryRouter = require('./routes/AdminRoute/GalleryRoute');
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

//error page
app.get('/errpage', (req, res) => {
    console.log("error page redirected");
    // res.render('error');
    res.sendFile(__dirname + '/views/error.html');
})

//logout
app.get('/logout', logout);
//Authentication Route
app.post('/auth/login', signIn);

app.get('/auth/login', (req, res) => {
    res.render('index');
});


//API Route
app.use('/v1/api/', API_Router);
//Dashboard Page
app.use('/dashboard', welcome, dashboardRouter);
//Customer & Installer Registration
app.use(['/register', '/customer', '/installer'], welcome, registerRouter);
//Catalogue Route
app.use('/catalogue', welcome, catalogueRouter);
//Order Route
app.use('/order', welcome, orderRouter);
//Complaint Route
app.use('/complaint', welcome, complaintRouter);
//New Job Route
app.use('/newjob', welcome, newjobRouter);
//Inquiry Route
app.use('/inquiry', welcome, inquiryRouter);
//Offer Route
app.use('/offer', welcome, offerRouter);
//Category Route
app.use('/category', welcome, categoryRouter);
//Area Route
app.use('/area', welcome, areaRouter);
//Gallery Route
app.use('/gallery', welcome, galleryRouter);
//Warranty Route
app.use('/warranty', welcome, warrantyRouter);

//Qr CODE
app.get('/qr',(req, res)=>{
    res.render('qr')
})

app.use('/common', commonRouter);

app.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}/`);
})