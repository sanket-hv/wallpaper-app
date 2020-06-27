
var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const fs = require('fs');
var tempimg = "";
//get data
router.get('/', (req, res) => {
    connection.query('SELECT * FROM CategoryTbl', function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.redirect('/errpage');
        }
        if (results) {
            var op = {
                flag: 0,
                success: "true",
                status: 200,
                data: results,
                message: "Redirected"
            }
            res.render('category', { op });
        }
    });
})

//add category
router.post('/add', async (req, res) => {
    let imgfile = req.files.categoryImage;
    let fname = Date.now() + req.files.categoryImage.name;
    await imgfile.mv('./public/images/category/' + fname, (err) => {
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
            let CategoryName = req.body.txtCategoryName;
            let sql = "INSERT INTO CategoryTbl(CategoryName,Img) VALUES(?,?)"
            let data = [CategoryName, fname];
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
                res.redirect('/category');
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
            res.redirect('/errpage');
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
            res.render('category', { op });
        }

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
                res.redirect('/errpage');
            }
            else {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: results,
                    message: "Redirected"
                }
                res.redirect('/category');
            }
        })
    }
    else {
        imgfile = req.files.categoryImage;
        fname = Date.now() + req.files.categoryImage.name;
        const rmpath = './public/images/category/' + tempimg;
        fs.unlink(rmpath, (err) => {
            if (err) {
                res.redirect('/errpage')
            }
            else {
                imgfile.mv('./public/images/category/' + fname, (err1) => {
                    if (err1) {
                        res.redirect('/errpage')
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