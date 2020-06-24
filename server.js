const express = require('express')
const app = express();
const cors = require("cors"); //for cross platform
const bodyParser = require('body-parser');
const path = require('path')
require('dotenv').config();
var compression = require("compression");
const fileUpload = require('express-fileupload');


// const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const conf = require('./config')
//for compress responses
app.use(compression());
//for enable cors
app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');

app.use(express.static('./public'));

//All Admin Router

//Offer Router
const offerRouter = require('./routes/AdminRoute/OfferRoute');
//Category Router
const categoryRouter = require('./routes/AdminRoute/CategoryRoute');




app.get('/',(req,res)=>{
    res.render('layout')
})

//Offer Route
app.use('/offer',offerRouter);

//Category Route
app.use('/category',categoryRouter);

app.listen(port,()=>{
    console.log(`Server is running on https://localhost:${port}/`);
})