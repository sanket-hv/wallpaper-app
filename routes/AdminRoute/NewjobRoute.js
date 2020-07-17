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
            connection.query('SELECT UserId,UserName FROM UserTbl WHERE RoleId=2', (error, installer, fields) => {
                if (error) {
                    res.redirect('/errpage');
                }
                else {
                    // res.send(results);
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
                            ilist: installer,
                            message: "Redirected"
                        }
                        res.render('newjob', { op })
                        // res.send({ op });
                    }
                }
            })
        }
    });
})

//Installer list
router.post('/ilist', (req, res) => {
    connection.query('SELECT * FROM UserTbl WHERE RoleId=2', (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            res.send(results);
        }
    })
})

//Change Status to "in progress"
router.post('/change', (req, res) => {
    let jobid = req.body.JobId;
    let inid = req.body.InstallerId;
    connection.query('UPDATE JobTbl SET JobStatus=?,AssignedTo=? WHERE JobId=?', [1, inid, jobid], (error, results, fields) => {
        if (error) {
            res.redirect('/errpage');
        }
        else {
            res.send("status changed");
        }
    })
})

//View the job details by passing JobID
router.get('/view/:jid', (req, res) => {
    let jobid = req.params.jid;
    connection.query('SELECT j.JobId,j.OrderId,j.JobStatus,a.AreaName,u.UserName,u.Address FROM JobTbl j, OrderTbl o,UserTbl u,AreaTbl a WHERE j.OrderId=o.OrderId AND o.CustomerId=u.UserId AND u.AreaId=a.AreaId AND j.JobId=?', [jobid], (error, job, fields) => {
        if (error) {
            console.error(error);
            res.redirect('/errpage');
        }
        else {
            connection.query('SELECT u.UserName FROM UserTbl u, JobTbl j Where u.UserId=j.AssignedTo AND j.JobId=?', [jobid], (error, installer, fields) => {
                if (error) {
                    res.redirect('/errpage');
                } else {
                    var tmpdate = job[0].CreatedAt;
                    var dt = format(tmpdate, 'dd-mm-yyyy');
                    var op = [];
                    if (installer.length > 0) {
                        op.push({
                            'JobId': job[0].JobId,
                            'cname': job[0].UserName,
                            'AreaName': job[0].AreaName,
                            'OrderId': job[0].OrderId,
                            'Status': job[0].JobStatus,
                            'iname': installer[0].UserName,
                            'CreatedAt': dt
                        })
                    }
                    else {
                        op.push({
                            'JobId': job[0].JobId,
                            'cname': job[0].UserName,
                            'AreaName': job[0].AreaName,
                            'OrderId': job[0].OrderId,
                            'Status': job[0].JobStatus,
                            'iname': "not assigned",
                            'CreatedAt': dt
                        })

                    }
                    res.render('newjobview', { op });
                }
            })
        }
    })
})
module.exports = router;