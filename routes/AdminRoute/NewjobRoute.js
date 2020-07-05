var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const format = require('dateformat');
router.get('/', (req, res) => {
    connection.query('SELECT j.JobId,o.CustomerId,u.UserName,j.OrderId,j.JobStatus,j.AssignedTo,j.CreatedAt FROM JobTbl j,UserTbl u, OrderTbl o WHERE j.OrderId = o.OrderId AND o.CustomerId=u.UserId', function (error, results, fields) {
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
                    'JobId': results[i].JobId,
                    'CustomerId': results[i].CustomerId,
                    'UserName': results[i].UserName,
                    'OrderId': results[i].OrderId,
                    'JobStatus': results[i].JobStatus,
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
                res.render('newjob', { op })
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

//Change Status to "in progress"
router.post('/change',(req,res)=>{
    let jobid= req.body.JobId;
    let inid = req.body.InstallerId;
    connection.query('UPDATE JobTbl SET JobStatus=?,AssignedTo=? WHERE JobId=?',[1,inid,jobid],(error, results, fields)=>{
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