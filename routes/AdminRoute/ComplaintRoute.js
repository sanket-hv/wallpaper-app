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
            // res.send(results);
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
                    message: "Redirected"
                }
                // res.render('orderlist', { op });
                res.render('complaint', { op })
                // res.send(newobj);
            }
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
        else
        {
            res.send(results);
        }
    })
})

//Change Status to in progress
router.post('/change',(req,res)=>{
    let cmpid= req.body.ComplaintId;
    let inid = req.body.InstallerId;
    connection.query('UPDATE ComplaintTbl SET ComplaintStatus=?,AssignedTo=? WHERE ComplaintId=?',[1,inid,cmpid],(error, results, fields)=>{
        if(error)
        {
            res.redirect('/errpage');
        }
        else{
            res.send("status changed");
        }
    })
})
module.exports = router;