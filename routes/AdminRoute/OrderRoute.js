var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const format = require('dateformat');

router.get('/', (req, res) => {

    var op = {
        flag: 0,
        success: "true",
        status: 200,
        message: "Redirected"
    }
    res.render('order', { op });
})


//View Order Details
router.get('/view/:id', (req, res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM OrderTbl WHERE OrderId=?', [id], (error, results, fields) => {
        if (error) {

        }
        else {
            res.send(results);
        }
    })
})

router.get('/list', (req, res) => {
    connection.query('SELECT o.OrderId,o.NODWarranty,o.CustomerId,u.UserName,u.ContactNo,o.CreatedAt FROM OrderTbl o,UserTbl u WHERE o.CustomerId=u.UserId AND u.RoleId=1', (error, results, fields) => {
        if (error) {
            res.redirect('/error')
        }
        else {
            var i
            var cnt = 1
            var newobj = [];
            for (i = 0; i < results.length; i++) {

                var tmpdate = results[i].CreatedAt;
                var dt = format(tmpdate, 'dd-mm-yyyy');
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

router.post('/pr', (req, res) => {

    // console.log("Method called");
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
            connection.query('INSERT INTO JobTbl(OrderId,JobStatus,AssignedTo) VALUES(?,?,?)', [oid, 0, 0], (error, results, fields) => {
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
                        var op = {
                            flag1: 0,
                            success: "true",
                            status: 200,
                            data: results,
                            message: "Order Created Successfully"
                        }
                        res.render('order', { op });
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

//show order detail
router.get('/detail/:oid', (req, res) => {
    console.log(req.params.oid);
    let orderid = req.params.oid;
    //getting product image SELECT p.* FROM ProductTbl p, OrderDetailsTbl od where od.ProductId=p.ProductId AND od.OrderId=2 
    //Done let sql = 'SELECT o.OrderId,u.UserName,s.ServiceName,w.TypeName,o.NODWarranty,o.CreatedAt FROM OrderTbl o,ServiceTbl s, WallpaperTypeTbl w, UserTbl u where u.UserId = o.CustomerId and o.ServiceId= s.ServiceId and o.TypeId=w.TypeId and o.OrderId=2';
    connection.query('SELECT o.OrderId,u.UserName,a.AreaName,s.ServiceName,w.TypeName,o.NODWarranty,o.CreatedAt FROM OrderTbl o,ServiceTbl s, WallpaperTypeTbl w, UserTbl u, AreaTbl a where u.AreaId = a.AreaId and u.UserId = o.CustomerId and o.ServiceId= s.ServiceId and o.TypeId=w.TypeId and o.OrderId=?', [orderid], (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        } else {
            // res.send(results[0])
            // var i
            // var cnt = 1
            var op = [];
            // for (i = 0; i < results.length; i++) {

                var tmpdate = results[0].CreatedAt;
                var dt = format(tmpdate, 'dd-mm-yyyy');
                op.push({
                    'OrderId': results[0].OrderId,
                    'UserName': results[0].UserName,
                    'AreaName': results[0].AreaName,
                    'ServiceName':results[0].ServiceName,
                    'TypeName':results[0].TypeName,
                    'NODWarranty': results[0].NODWarranty,
                    'CreatedAt': dt
                })
            //     cnt += 1
            // }if (cnt > results.length) {
            //     var op = {
            //         flag: 0,
            //         success: "true",
            //         status: 200,
            //         data: newobj,
            //         message: "Redirected"
            //     }
                res.render('orderview', { op });
                // res.send()
            // }
        }
    })
})
module.exports = router;