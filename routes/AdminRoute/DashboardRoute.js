var connection = require('./../../config');
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index');
})

module.exports = router; 