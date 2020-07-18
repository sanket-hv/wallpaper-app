var connection = require('./../../config');
const express = require('express');
const router = express.Router();

//get data
router.get('/', (req, res) => {
    connection.query('SELECT * FROM OfferTbl', function (error, results, fields) {
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
        }
        res.render('offer', { op });
    });
})

//edit data page
router.get('/edit/:id', (req, res) => {
    let oid = req.params.id;
    connection.query('SELECT * FROM OfferTbl WHERE OfferId = ?', [oid], function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
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
            res.render('offer', { op });
        }
        else {
            console.log('false')
            var op = {
                flag: 0,
                success: "false",
                status: 200,
                data: results,
                message: "Offer Not Available"
            }
            res.render('offer', { op });
        }
        
    });
})

//edit submit
router.post('/edit', (req, res) => {
    let offerid = req.body.txtOfferId
    let offername = req.body.txtOfferName
    let data = [offername, offerid];
    let sql = "UPDATE OfferTbl SET OfferName = ? WHERE OfferId = ?";
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
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
            res.redirect('/offer');
        }
        
    })
})

//IsActive Status change
router.post('/isactive',(req,res)=>{
    let offerid = req.body.offerid;
    let val = req.body.val;
    let tempval
    if (val == 0) {
        tempval = 1;
    }
    else {
        tempval = 0
    }
    connection.query('UPDATE OfferTbl SET IsActive = ? WHERE OfferId = ?',[tempval,offerid],(error,results, fields)=>{
        if(error)
        {
            res.redirect('/errpage');
        }
        else{
            res.send("updated");
        }
    })
})

module.exports = router;