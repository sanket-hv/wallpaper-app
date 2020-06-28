var connection = require('./../../config');
const express = require('express');
const router = express.Router();

//get data
router.get('/', (req, res) => {
    connection.query('SELECT * FROM WarrantyTbl', function (error, results, fields) {
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
            res.render('warranty', { op });
        }

    });
})

//add Database
router.post('/add', (req, res) => {
    let warrantyname = req.body.txtWarrantyName;
    let warrantyvalue = req.body.txtWarrantyValue;
    connection.query('INSERT INTO WarrantyTbl(WarrantyName,WarrantyValue) VALUES(?,?)', [warrantyname, warrantyvalue], function (error, results, fields) {
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
            res.redirect('/warranty');
        }
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
            res.redirect('/errpage')
        }
        else if (results.length > 0) {
            var op = {
                flag: 1,
                success: "true",
                status: 200,
                data: results,
                message: "Redirected"
            }
            res.render('warranty', { op });
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
            res.render('warranty', { op });
        }
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
            res.redirect('/errpage')
        }
        else {
            var op = {
                flag: 0,
                success: "true",
                status: 200,
                data: results,
                message: "Redirected"
            }
            res.redirect('/warranty');
        }
    })
})

module.exports = router;