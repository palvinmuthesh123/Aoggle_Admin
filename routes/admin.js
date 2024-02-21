const express = require('express');
const router = express.Router();
const adminHelper = require("../helpers/admin-helpers");

router.post('/login',(req,res)=>{
    console.log("route working")
    adminHelper.doLogin(req.body).then((response)=>{
        console.log(response)
        res.json(response)
    })
});


router.get('/get-dashboard-data',(req,res)=>{
    adminHelper.getDashboardData().then((response)=>{
        res.json(response)
    })
});


router.post('/set-approved',(req,res)=>{
    adminHelper.setApprove(req.body).then((response)=>{
        res.json(response);
    })
});



router.post('/set-unapproved',(req,res)=>{
    adminHelper.setunApprove(req.body).then((response)=>{
        res.json(response);
    })
});


router.post('/delete-post',(req,res)=>{
    console.log('delete-post')
    adminHelper.deletePost(req.body).then((response)=>{
        res.json(response)
    })
})

module.exports = router;