"use strict";var express=require("express"),app=express(),cors=require("cors"),bodyParser=require("body-parser"),path=require("path");require("dotenv").config();var compression=require("compression"),fileUpload=require("express-fileupload"),cookieParser=require("cookie-parser"),session=require("express-session"),_require=require("./middleware/AdminAuth"),signIn=_require.signIn,welcome=_require.welcome,logout=_require.logout,port=process.env.PORT,conf=require("./config");app.use(compression()),app.use(cookieParser()),app.use(session({secret:"Shh, its a secret!",saveUninitialized:!0,resave:!0})),app.use(cors()),app.use(fileUpload()),app.use(bodyParser.json()),app.use(bodyParser.urlencoded({extended:!0})),app.set("views",path.join(__dirname+"/views")),app.set("view engine","pug"),app.use(express.static("./public"));var registerRouter=require("./routes/AdminRoute/RegisterRoute"),offerRouter=require("./routes/AdminRoute/OfferRoute"),inquiryRouter=require("./routes/AdminRoute/InquiryRoute"),catalogueRouter=require("./routes/AdminRoute/CatalogueRoute"),orderRouter=require("./routes/AdminRoute/OrderRoute"),categoryRouter=require("./routes/AdminRoute/CategoryRoute"),areaRouter=require("./routes/AdminRoute/AreaRoute"),warrantyRouter=require("./routes/AdminRoute/WarrantyRoute"),commonRouter=require("./routes/CommonRouter");app.get("/",function(e,r){r.render("login")}),app.get("/login",function(e,r){r.render("login")}),app.get("/logout",logout),app.post("/auth/login",signIn),app.get("/auth/login",function(e,r){r.render("index")}),app.use(["/register","/customer","/installer"],welcome,registerRouter),app.use("/catalogue",welcome,catalogueRouter),app.use("/order",welcome,orderRouter),app.use("/inquiry",welcome,inquiryRouter),app.use("/offer",welcome,offerRouter),app.use("/category",welcome,categoryRouter),app.use("/area",welcome,areaRouter),app.use("/warranty",welcome,warrantyRouter),app.use("/common",commonRouter),app.listen(port,function(){console.log("Server is running on https://localhost:".concat(port,"/"))});