var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const format = require('dateformat');

//get data
router.get('/', (req, res) => {
    connection.query('SELECT cp.ComplaintId,o.CustomerId,u.UserName,cp.OrderId,cp.Remarks,cp.ComplaintStatus,cp.AssignedTo,cp.CreatedAt FROM ComplaintTbl cp,UserTbl u, OrderTbl o WHERE cp.OrderId = o.OrderId AND o.CustomerId=u.UserId', function (error, results, fields) {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            connection.query('SELECT UserId,UserName FROM UserTbl WHERE RoleId = 2', (error, installer, fields) => {
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
                            'ComplaintId': results[i].ComplaintId,
                            'CustomerId': results[i].CustomerId,
                            'UserName': results[i].UserName,
                            'OrderId': results[i].OrderId,
                            'Remarks': results[i].Remarks,
                            'ComplaintStatus': results[i].ComplaintStatus,
                            'AssignedTo': results[i].AssignedTo,
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
                            ilist: installer,
                            message: "Redirected"
                        }
                        // res.render('orderlist', { op });
                        res.render('complaint', { op })
                    }
                }
            })
        }
    });
})

//Installer list
router.post('/ilist', (req, res) => {
    // console.log("Installer list")
    connection.query('SELECT * FROM UserTbl WHERE RoleId=2', (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            res.send(results);
        }
    })
})

//Change Status to in progress
router.post('/change', (req, res) => {
    let cmpid = req.body.ComplaintId;
    let inid = req.body.InstallerId;
    connection.query('UPDATE ComplaintTbl SET ComplaintStatus=?,AssignedTo=? WHERE ComplaintId=?', [1, inid, cmpid], (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            res.send("status changed");
        }
    })
})

router.get('/view/:cid', (req, res) => {
    let complaintid = req.params.cid;
    console.log(complaintid)
    connection.query('SELECT c.ComplaintId,u.UserName,a.AreaName,u.Address,c.OrderId,c.ComplaintImg,c.Remarks,c.ComplaintStatus,c.CreatedAt FROM ComplaintTbl c,OrderTbl o, UserTbl u,AreaTbl a WHERE u.AreaId = a.AreaId AND c.OrderId=o.OrderId AND o.CustomerId=u.UserId AND c.ComplaintId=?', [complaintid], (error, complaints, fields) => {
        if (error) {
            console.log("first")
            res.redirect('/errpage');
        }
        else {
            connection.query('SELECT u.UserName from ComplaintTbl c, UserTbl u where c.AssignedTo = u.UserId AND c.ComplaintId=?', [complaintid], (error, installer, fields) => {
                if (error) {
                    console.log("second")
                    res.redirect('/errpage')
                }
                else {
                    var tmpdate = complaints[0].CreatedAt;
                    var dt = format(tmpdate, 'dd-mm-yyyy');
                    var op = [];
                    if (installer.length > 0) {
                        op.push({
                            'ComplaintId': complaints[0].ComplaintId,
                            'cname': complaints[0].UserName,
                            'AreaName': complaints[0].AreaName,
                            'OrderId': complaints[0].OrderId,
                            'ComplaintImg': complaints[0].ComplaintImg,
                            'Remarks': complaints[0].Remarks,
                            'Status': complaints[0].ComplaintStatus,
                            'iname': installer[0].UserName,
                            'CreatedAt': dt
                        })
                    }
                    else {
                        op.push({
                            'ComplaintId': complaints[0].ComplaintId,
                            'cname': complaints[0].UserName,
                            'AreaName': complaints[0].AreaName,
                            'OrderId': complaints[0].OrderId,
                            'ComplaintImg': complaints[0].ComplaintImg,
                            'Remarks': complaints[0].Remarks,
                            'Status': complaints[0].ComplaintStatus,
                            'iname': "Not Assigned",
                            'CreatedAt': dt
                        })
                    }
                    res.render('complaintview', { op });
                }
            })
        }
    })
})
module.exports = router;