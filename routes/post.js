const express = require('express');
const router = express.Router();
const postHelper = require("../helpers/post-helpers");


router.post('/post-video',(req,res)=>{
    console.log("post route working")
    postHelper.doPost(req.body).then((response)=>{
        if(response){
            res.json(response)
        }
    }).catch((error)=>{
        console.log(error);
        res.json({status:"fail",message:"Something went Wrong ,Please try again later"})
    })
});


router.get('/get-posts',(req,res)=>{
    console.log("get post working");
    postHelper.getPosts().then((response)=>{
        res.json({response});
    })
})

router.get('/get-profile-posts',(req,res)=>{
    console.log("router working")
    console.log(req.query.userId);
    postHelper.getProfilePosts(req.query.userId).then((response)=>{
        res.json(response)
    })
})



module.exports = router;
