var connection = require('./../config');
const express = require('express');
const router = express.Router();

//This is for AREA AJAX Call
router.post('/area', (req, res) => {
    if (req.body.message == "ajaxarea") {
        connection.query('SELECT * FROM AreaTbl WHERE IsActive = ?', [0], function (error, results, fields) {
            // console.log('common area');
            if (error) {
                res.redirect('/errpage');
            }
            else {
                res.send(results);
            }
        });
    }
})

//Role
router.post('/role', (req, res) => {
    if (req.body.message == "ajaxrole") {
        connection.query('SELECT * FROM RoleTbl', function (error, results, fields) {
            // console.log('common area');
            if (error) {
                res.redirect('/errpage');
            }
            else {
                res.send(results);
            }
        });
    }
})
//category
router.post('/category', (req, res) => {
    if (req.body.message == "ajaxcategory") {
        connection.query('SELECT * FROM CategoryTbl WHERE IsActive = ?', [0], function (error, results, fields) {
            // console.log('common area');
            if (error) {
                res.redirect('/errpage');
            }
            else {
                res.send(results);
            }
        });
    }
})

//Wallpaper Service
router.post('/service', (req, res) => {
    if (req.body.message == "ajaxservice") {
        connection.query('SELECT * FROM ServiceTbl', function (error, results, fields) {
            if (error) {
                res.redirect('/errpage');
            }
            else {
                res.send(results);
            }
        });
    }
})

//Wallpaper Type
router.post('/type', (req, res) => {
    if (req.body.message == "ajaxtype") {
        connection.query('SELECT * FROM WallpaperTypeTbl', function (error, results, fields) {
            if (error) {
                res.redirect('/errpage');
            }
            else {
                res.send(results);
            }
        });
    }
})
//Product
router.post('/product', (req, res) => {
    if (req.body.message == "ajaxproduct") {
        connection.query('SELECT * FROM ProductTbl WhERE IsActive = ? ', [0], function (error, results, fields) {
            if (error) {
                res.redirect('/errpage');
            }
            else {
                res.send(results);
            }
        });
    }
})

//Customer
router.post('/customer', (req, res) => {
    if (req.body.message == "ajaxcustomer") {
        connection.query('SELECT * FROM UserTbl WHERE RoleId = ?', [1], function (error, results, fields) {
            if (error) {
                res.redirect('/errpage');
            }
            else {
                res.send(results);
            }
        });
    }
})

//warranty
router.post('/warranty', (req, res) => {
    if (req.body.message == "ajaxwarranty") {
        connection.query('SELECT * FROM WarrantyTbl WHERE IsActive = ?', [0], function (error, results, fields) {
            if (error) {
                res.redirect('/errpage');
            }
            else {
                res.send(results);
            }
        });
    }
})
module.exports = router;