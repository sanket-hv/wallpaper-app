
var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const fs = require('fs');
//get data
router.get('/', (req, res) => {
    res.render('catalogue');
})

router.get('/view', (req, res) => {
    connection.query('SELECT p.ProductId,c.CategoryName,s.ServiceName,t.TypeName,p.ProductTitle,p.Price,p.Details,p.IsActive,p.ProductImg FROM ProductTbl p, CategoryTbl c, ServiceTbl s, WallpaperTypeTbl t WHERE p.CategoryId=c.CategoryId AND p.ServiceId=s.ServiceId AND p.TypeId=t.TypeId', function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.send({ op })
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
            res.render('catalogueview',{ op });
            // res.render('customer', { op });
        }
    });
})

//add category
router.post('/add', async (req, res) => {
    let categoryid = req.body.cmbCategory;
    let serviceid = req.body.cmbService;
    let typeid = req.body.cmbType;
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
        }
        else {
            let sql = "INSERT INTO ProductTbl(CategoryId,ServiceId,TypeId,ProductTitle,Price,Details,IsActive,ProductImg) VALUES(?,?,?,?,?,?,?,?)"
            let data = [categoryid, serviceid, typeid, title, price, details, 0, fname];
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
                        message: "Redirected"
                    }
                }
                res.redirect('/catalogue');
            })
        }
    })
})

//edit data page
router.get('/edit/:id', (req, res) => {
    let cid = req.params.id;
    const sql = 'SELECT * FROM CategoryTbl WHERE CategoryId = ?';
    connection.query('SELECT * FROM CategoryTbl WHERE CategoryId = ?', [cid], function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
        }
        else {
            if (results.length > 0) {
                var op = {
                    flag: 1,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
            }
            else {
                var op = {
                    flag: 0,
                    success: "false",
                    status: 200,
                    data: results,
                    message: "Category Not Available"
                }
            }
        }
        tempimg = op.data[0].Img;
        // console.log(tempimg)
        res.render('category', { op });
    });
})

//edit submit
router.post('/edit', async (req, res) => {
    const CategoryName = req.body.txtCategoryName;
    const cid = req.body.txtCategoryId;
    var sql = "";
    if (!req.files) {
        console.log("File not found");
        sql = "UPDATE CategoryTbl SET CategoryName = ? WHERE CategoryId = ?";
        connection.query(sql, [CategoryName, cid], (error, results, fields) => {
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
                    message: "Redirected"
                }
            }
            res.redirect('/category');
        })
    }
    else {
        imgfile = req.files.categoryImage;
        fname = Date.now() + req.files.categoryImage.name;
        const rmpath = './public/images/category/' + tempimg;
        fs.unlink(rmpath, (err) => {
            if (err) {
                res.send("error file remove")
            }
            else {
                imgfile.mv('./public/images/category/' + fname, (err1) => {
                    if (err1) {
                        console.log(err1)
                    }
                    else {
                        console.log("File deleted")
                        sql = "UPDATE CategoryTbl SET CategoryName = ?, Img = ? WHERE CategoryId = ?";
                        connection.query(sql, [CategoryName, fname, cid], (error, results, fields) => {
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
                                    message: "Redirected"
                                }
                            }
                            res.redirect('/category');
                        })

                    }
                })

            }
        })
    }



})

module.exports = router;