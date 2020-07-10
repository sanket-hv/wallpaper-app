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
            res.redirect('/errpage')
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

router.get('/detail/:oid',(req,res)=>{
    let orderid = req.params.oid;
    connection.query('SELECT o.OrderId,u.UserName,a.AreaName,s.ServiceName,w.TypeName,o.NODWarranty,o.CreatedAt FROM OrderTbl o,ServiceTbl s, WallpaperTypeTbl w, UserTbl u, AreaTbl a where u.AreaId = a.AreaId and u.UserId = o.CustomerId and o.ServiceId= s.ServiceId and o.TypeId=w.TypeId and o.OrderId=?', [orderid], (error, results, fields) => {
        if (error) {
            // return res.json({
            //     status: false,
            //     message: err.message
            // }).end()
            res.redirect('/errpage');
        }
        else {
            connection.query('SELECT p.ProductId,c.CategoryName,p.ProductTitle,p.Price,p.Details,p.ProductImg FROM ProductTbl p,CategoryTbl c, OrderDetailsTbl od where p.CategoryId=c.CategoryId AND od.ProductId=p.ProductId AND od.OrderId=?', [orderid], (error, products, fields) => {
                if (error) {
                    // return res.json({
                    //     status: false,
                    //     message: err.message
                    // }).end()
                    res.redirect('/errpage')
                }
                else {
                    var host = req.headers.host;
                    var imagepath = host + "/images/product";
                    var tmpdate = results[0].CreatedAt;
                    var dt = format(tmpdate, 'dd-mm-yyyy');
                    var op = [];
                    if (products.length > 0) 
                    {
                        // var i = 0;
                        // for (i = 0; i < products.length; i++) {
                        //     var img = products[i].ProductImg;
                        //     if (img !== undefined) {
                        //         products[i].ProductImg = imagepath + '/' + img;
                        //     }
                        // }
                        op.push({
                            'OrderId': results[0].OrderId,
                            'UserName': results[0].UserName,
                            'AreaName': results[0].AreaName,
                            'ServiceName': results[0].ServiceName,
                            'TypeName': results[0].TypeName,
                            'NODWarranty': results[0].NODWarranty,
                            'product': products,
                            'CreatedAt': dt
                        })
                        // return res.json({
                        //     status: true,
                        //     message: "Order Details are found",
                        //     categories: op
                        // })
                        res.render('orderview',{op});
                    }
                }
            })
        }
    })
})

// router.get('/detail/:oid', (req, res) => {
//     // console.log(req.params.oid);
//     let orderid = req.params.oid;
//     //getting product image SELECT p.* FROM ProductTbl p, OrderDetailsTbl od where od.ProductId=p.ProductId AND od.OrderId=2 
//     //Done let sql = 'SELECT o.OrderId,u.UserName,s.ServiceName,w.TypeName,o.NODWarranty,o.CreatedAt FROM OrderTbl o,ServiceTbl s, WallpaperTypeTbl w, UserTbl u where u.UserId = o.CustomerId and o.ServiceId= s.ServiceId and o.TypeId=w.TypeId and o.OrderId=2';
//     connection.query('SELECT o.OrderId,u.UserName,a.AreaName,s.ServiceName,w.TypeName,o.NODWarranty,o.CreatedAt FROM OrderTbl o,ServiceTbl s, WallpaperTypeTbl w, UserTbl u, AreaTbl a where u.AreaId = a.AreaId and u.UserId = o.CustomerId and o.ServiceId= s.ServiceId and o.TypeId=w.TypeId and o.OrderId=?', [orderid], (error, results, fields) => {
//         if (error) {
//             res.redirect('/errpage');
//         } else {
//             var op = [];

//             var tmpdate = results[0].CreatedAt;
//             var dt = format(tmpdate, 'dd-mm-yyyy');
//             // op.push({
//             //     'OrderId': results[0].OrderId,
//             //     'UserName': results[0].UserName,
//             //     'AreaName': results[0].AreaName,
//             //     'ServiceName':results[0].ServiceName,
//             //     'TypeName':results[0].TypeName,
//             //     'NODWarranty': results[0].NODWarranty,
//             //     'CreatedAt': dt
//             // })
//             results[0].CreatedAt = dt;
//             op.push(results)
//             res.render('orderview', op);
//         }
//     })
// })

router.post('/productimg', (req, res) => {
    let oid = req.body.OrderId;
    console.log('img' + oid);
    connection.query('SELECT p.ProductId,c.CategoryName,p.ProductTitle,p.Price,p.ProductImg,p.Details FROM ProductTbl p, OrderDetailsTbl od, CategoryTbl c where od.ProductId = p.ProductId AND p.CategoryId = c.CategoryId AND od.OrderId=?', [oid], (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            res.send(results);
        }
    })
})
module.exports = router;