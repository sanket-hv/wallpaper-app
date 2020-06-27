var connection = require('./../../config');
const express = require('express');
const format = require('dateformat');
const router = express.Router();

// get data
router.get('/', (req, res) => {
    // console.log('inquiry');
    connection.query('SELECT * FROM InquiryTbl', function (error, results, fields) {
        if (error) {
            var op = {
                success: "false",
                status: 404,
                data: error
            }
            res.redirect('/errpage');
        }
        if (results) {
            var i
            var cnt = 1
            var newobj = [];
            for (i = 0; i < results.length; i++) {

                var tmpdate = results[i].InquiryDate;
                var dt = format(tmpdate,'dd-mm-yyyy');
                newobj.push({
                    'InquiryId': results[i].InquiryId,
                    'InquiryDate': dt,
                    'Name': results[i].Name,
                    'ContactNo': results[i].ContactNo,
                    'EmailId': results[i].EmailId,
                    'IsAttended': results[i].IsAttended
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
                res.render('inquiry', { op });
            }
        }
    });
})

router.post('/edit', (req, res) => {
    let id = req.body.id;
    let val = req.body.val
    let tempval
    if (val == 0) {
        tempval = 1;
    }
    else {
        tempval = 0
    }
    connection.query('UPDATE InquiryTbl SET IsAttended = ? WHERE InquiryId = ?',[tempval,id],(error,results, fields)=>{
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