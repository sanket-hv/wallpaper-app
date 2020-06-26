var connection = require('./../config');
const express = require('express');
const router = express.Router();

//This is for AREA AJAX Call
router.post('/area', (req, res) => {
    if (req.body.message == "ajaxarea") {
        connection.query('SELECT * FROM AreaTbl', function (error, results, fields) {
            // console.log('common area');
            if (error) {
                res.send('error');
            }
            else {
                res.send(results);
            }
        });
    }
})

router.post('/role', (req, res) => {
    if (req.body.message == "ajaxrole") {
        connection.query('SELECT * FROM RoleTbl', function (error, results, fields) {
            // console.log('common area');
            if (error) {
                res.send('error');
            }
            else {
                res.send(results);
            }
        });
    }
})

module.exports = router;