var connection = require('./../../config');
const express = require('express');
const router = express.Router();
const format = require('date-format');
const md5 = require('md5');
//get data
router.get('/', (req, res) => {
    res.render('register')
})

//Customer List
router.get('/clist', (req, res) => {
    console.log("customer list")
    connection.query('SELECT u.UserId,u.UserName,u.Email,a.AreaName FROM UserTbl u,AreaTbl a WHERE u.AreaId = a.AreaId AND u.RoleId=?', [1], function (error, results, fields) {
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
            res.render('customer', { op });
        }
    });
})

//Installer List
router.get('/ilist', (req, res) => {
    connection.query('SELECT u.UserId,u.UserName,u.Email,a.AreaName FROM UserTbl u,AreaTbl a WHERE u.AreaId = a.AreaId AND u.RoleId=?', [2], function (error, results, fields) {
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
            res.render('installer', { op });
        }
    });
})


//add Database
router.post('/add', (req, res) => {
    let username = req.body.txtUsername;
    let email = req.body.txtEmail;
    let password = md5(req.body.txtPassword);
    let areaid = req.body.cmbArea
    let roleid = req.body.cmbRole;
    // let createdat = format.asString('yyyy-mm-dd hh:mm:ss',new Date());
    let val = [username, email, password, areaid, roleid];
    connection.query('INSERT INTO UserTbl(UserName,Email,Password,AreaId,RoleId,CreatedAt) VALUES(?,?,?,?,?)', val, function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
        }
        if (results) {
            var op = {
                flag: 0,
                success: "true",
                status: 200,
                data: results,
                message: "Redirected"
            }
        }
        res.redirect('/register');
    });
})

//edit data page
router.get('/edit/:id', (req, res) => {
    let wid = req.params.id;
    connection.query('SELECT * FROM WarrantyTbl WHERE WarrantyId = ?', [wid], function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
        }
        else if (results.length > 0) {
            var op = {
                flag: 1,
                success: "true",
                status: 200,
                data: results,
                message: "Redirected"
            }
        }
        else {
            console.log('false')
            var op = {
                flag: 0,
                success: "false",
                status: 200,
                data: results,
                message: "Warranty Not Available"
            }
        }
        res.render('warranty', { op });
    });
})

//edit submit
router.post('/edit', (req, res) => {
    let warrantyid = req.body.txtWarrantyId
    let warrantyname = req.body.txtWarrantyName
    let warrantyvalue = req.body.txtWarrantyValue
    let data = [warrantyname, warrantyvalue, warrantyid];
    let sql = "UPDATE WarrantyTbl SET WarrantyName = ?,WarrantyValue= ? WHERE WarrantyId = ?";
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
        res.redirect('/warranty');
    })
})

module.exports = router;