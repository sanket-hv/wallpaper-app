var connection = require('./../../config');
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('order');
})

router.post('/add',(req,res)=>{
    let cmb = req.body.cmbtest;
    res.send(cmb);
})
module.exports = router;