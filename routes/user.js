const { response } = require('express');
const express = require('express');
const router = express.Router();
const userHelper = require("../helpers/user-helpers")


// Sign Up
router.post('/signup', (req, res) => {
    console.log("register working ",req.body)
    userHelper.doSignUp(req.body).then((response)=>{
        console.log(response)
        res.json(response);
    })
});

//OTP Verification
router.post("/otpVerification",(req,res)=>{
    console.log("otpVerification working ",req.body);
    userHelper.verifyotp(req.body).then((response)=>{
        console.log(response);
        res.json(response);
    })
})


// Login
router.post('/login',(req,res)=>{
    console.log("Login working")
    userHelper.doLogin(req.body).then((response)=>{
        res.json(response);
    })
});

// Create Post
router.post('/createPost',(req,res)=>{
    console.log("createPost route working")
    userHelper.doCreatePost(req.body).then((response)=>{
        console.log(response)
        res.json(response);
    })
});


router.get('/get-users',(req,res)=>{
    userHelper.getAllUsers().then((response)=>{
        res.json(response);
    }).catch(error=>{
        console.log(error);
    })
});

router.post("/set-online",(req,res)=>{
    console.log("working",req.body)
//     userHelper.setOnline(req.body).then((response)=>{
        
//     })
})




module.exports = router;
