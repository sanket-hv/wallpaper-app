var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const format = require('dateformat');

router.get('/', (req, res) => {
    connection.query('SELECT * FROM ProductTbl', function (error, results, fields) {
        if (error) {
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
        }
        res.render('order', { results });
    });
})


//View Order Details
router.get('/view/:id',(req,res)=>{
    let id = req.params.id;
    connection.query('SELECT * FROM OrderTbl WHERE OrderId=?',[id],(error, results, fields)=>{
        if(error)
        {

        }
        else
        {
            res.send(results);
        }
    })
})

router.get('/list',(req,res)=>{
    connection.query('SELECT o.OrderId,o.NODWarranty,o.CustomerId,u.UserName,u.ContactNo,o.CreatedAt FROM OrderTbl o,UserTbl u WHERE o.CustomerId=u.UserId AND u.RoleId=1',(error, results, fields)=>{
        if(error)
        {
            res.redirect('/error')
        }
        else
        {
            var i
            var cnt = 1
            var newobj = [];
            for (i = 0; i < results.length; i++) {

                var tmpdate = results[i].CreatedAt;
                var dt = format(tmpdate,'dd-mm-yyyy');
                newobj.push({
                    'OrderId': results[i].OrderId,
                    'NODWarranty': results[i].NODWarranty,
                    'CustomerId': results[i].CustomerId,
                    'UserName': results[i].UserName,
                    'ContactNo': results[i].ContactNo,
                    'CreatedAt': dt
                })
                cnt += 1
            }
            if (cnt > results.length) {
                var op = {
                    flag: 0,
                    success: "true",
                    status: 200,
                    data: newobj,
                    message: "Redirected"
                }
                res.render('orderlist', { op });
                // res.send(newobj)
            }
        }
    })
})

router.get('/pr', (req, res) => {
    connection.query('SELECT * FROM ProductTbl', function (error, results, fields) {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            res.send(results);
        }
    });
})

//Create Order
router.post('/add', (req, res) => {
    let customerid = req.body.cmbCustomer;
    let productid = req.body.txtProductName;
    let warranty = req.body.txtWarranty;
    let serviceid = req.body.cmbService;
    let typeid = req.body.cmbType;
    var oid
    connection.query('INSERT INTO OrderTbl(CustomerId,ServiceId,TypeId,NODWarranty,WarrantyExpired) VALUES (?,?,?,?,?)', [customerid, serviceid, typeid, warranty, 0], (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            // console.log(results.insertId);
            oid = results.insertId;
            var flag = productid.length
            var i
            connection.query('INSERT INTO JobTbl(CustomerId,OrderId,JobStatus,AssignedTo) VALUES(?,?,?,?)', [customerid, oid, 0, 0], (error, results, fields) => {
                if (error) {
                    res.redirect('/errpage');
                }
                else {
                    for (i = 0; i < productid.length; i++) {
                        // console.log(i);
                        // console.log(productid[i])
                        connection.query('INSERT INTO OrderDetailsTbl(OrderId,ProductId) VALUES(?,?)', [oid, productid[i]], (error, results, fields) => {
                            if (error) {
                                res.redirect('/errpage');
                            }
                            else {
                                //Do nothing
                                // console.log(i);
                            }
                            flag = i
                        })
                    }
                    if (i == flag) {
                        res.redirect('/order');
                    }
                    else {
                        console.log("no" + flag);
                    }
                }
            })
        }
    })
    // res.send(cmb);
})
module.exports = router;