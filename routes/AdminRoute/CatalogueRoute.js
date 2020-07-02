
var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const fs = require('fs');
//get data
router.get('/', (req, res) => {
    var op = {
        flag: 1,
        success: "true",
        message: "Product Added Successfully"
    }
    res.render('catalogue', { op });
})

router.get('/view', (req, res) => {
    connection.query('SELECT p.ProductId,c.CategoryName,p.ProductTitle,p.Price,p.Details,p.IsActive,p.ProductImg FROM ProductTbl p, CategoryTbl c WHERE p.CategoryId=c.CategoryId', function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.redirect('/errpage');
        }
        else {
            if (results) {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
            }
            res.render('catalogueview', { op });
            // res.render('customer', { op });
        }
    });
})

//add category
router.post('/add', async (req, res) => {
    let categoryid = req.body.cmbCategory;
    let title = req.body.txtTitle;
    let price = req.body.txtPrice;
    let details = req.body.txtDetail;
    let imgfile = req.files.ProductImage;
    let fname = Date.now() + req.files.ProductImage.name;
    await imgfile.mv('./public/images/product/' + fname, (err) => {
        if (err) {
            console.log(err)
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.redirect('/errpage');
        }
        else {
            let sql = "INSERT INTO ProductTbl(CategoryId,ProductTitle,Price,Details,IsActive,ProductImg) VALUES(?,?,?,?,?,?)"
            let data = [categoryid, title, price, details, 0, fname];
            connection.query(sql, data, (error, results, fields) => {
                if (error) {
                    var op = {
                        success: "false",
                        status: 404,
                        data: error
                    }
                }
                else {
                    var op = {
                        flag: 0,
                        success: "true",
                        status: 200,
                        data: results,
                        message: "Product Added Successfully"
                    }
                }
                res.render('catalogue', { op });
            })
        }
    })
})

module.exports = router;