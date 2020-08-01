
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


//product select for edit
router.get('/edit/:id', (req, res) => {

    // console.log("called");
    let id = req.params.id
    let sql = "select * from ProductTbl where ProductId = ?"
    connection.query(sql, [id], (error, result) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            
            if (result.length > 0) {
                var op = {
                    flag: 2,
                    success: "true",
                    status: 200,
                    data: result,
                    message: "Redirected"
                }
            }
            else {
                var op = {
                    flag: 1,
                    success: "false",
                    status: 200,
                    data: result,
                    message: "Product Not Available"
                }
            }
            // console.log(op.data[0].Details);
            res.render('catalogue', { op });
        }
    })
})

//Edit submit
router.post('/editSubmit',(req,res)=>{
    let pid = req.body.txtProductId
    let title = req.body.txtTitle
    let price = req.body.txtPrice
    let detail = req.body.txtDetail

    let sql = "UPDATE ProductTbl SET ProductTitle = ?, Price = ?, Details = ? WHERE ProductId = ?"
    connection.query(sql,[title,price,detail,pid],(error,result)=>{
        if(error){
            res.redirect('/errpage');
        }
        else{
            if(result.affectedRows > 0)
            {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: result,
                    message: "Product Edited Successfully"
                }
            }
            else
            {
                var op = {
                    success: "false",
                    status: 404,
                    data: error
                }
            }
            res.redirect('/catalogue/view');
        }
    })
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


//IsActive Status change
router.post('/edit', (req, res) => {
    let productid = req.body.productid;
    let val = req.body.val;
    let tempval
    if (val == 0) {
        tempval = 1;
    }
    else {
        tempval = 0
    }
    connection.query('UPDATE ProductTbl SET IsActive = ? WHERE ProductId = ?', [tempval, productid], (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            res.send("updated");
        }
    })

})



module.exports = router;