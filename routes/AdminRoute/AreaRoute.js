var connection = require('./../../config');
const express = require('express');
const router = express.Router();

//get data
router.get('/', (req, res) => {
    connection.query('SELECT * FROM AreaTbl', function (error, results, fields) {
        if (error) {
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
            
        res.render('area', { op });
        }
    });
})

//add Database
router.post('/add', (req, res) => {
    let areaname = req.body.txtAreaName;
    connection.query('INSERT INTO AreaTbl(AreaName) VALUES(?)', [areaname], function (error, results, fields) {
        if (error) {
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
            
        res.redirect('/area');
        }
    });
})

//edit data page
router.get('/edit/:id', (req, res) => {
    let aid = req.params.id;
    connection.query('SELECT * FROM AreaTbl WHERE AreaId = ?', [aid], function (error, results, fields) {
        if (error) {
            res.redirect('/errpage');
        }
        else if (results.length > 0) {
            var op = {
                flag: 1,
                success: "true",
                status: 200,
                data: results,
                message: "Redirected"
            }
            res.render('area', { op });
        }
        else {
            var op = {
                flag: 0,
                success: "false",
                status: 200,
                data: results,
                message: "Area Not Available"
            }
            res.render('area', { op });
        }
        
    });
})

//edit submit
router.post('/edit', (req, res) => {
    let areaid = req.body.txtAreaId
    let areaname = req.body.txtAreaName
    let data = [areaname, areaid];
    let sql = "UPDATE AreaTbl SET AreaName = ? WHERE AreaId = ?";
    connection.query(sql, data, (error, results, fields) => {
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
            res.redirect('/area');
        }
        
    })
})

module.exports = router;