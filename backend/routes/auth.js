const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const router = express.Router();


const{JWT_SECRET}= require("../config/keys");


//Signup
router.post("/signup",async(req,res)=>{
    const {username,password} =req.body;
    const hashPassword = await bcrypt.hash(password,10);
    try{
        await User.create({username,password:hashPassword});
        res.status(201).json("User created successfully");
        console.log("User created successfully");

    }
    catch{
        res.status(400).json("Username already exists");
        console.log("Username already exists");
    }
})


//Signin

router.post("/signin",async(req,res)=>{
    const {username,password} = req.body;
    const user =  await  User.findOne({username});
    if(!user){
        return res.status(404).json("User not found");
        console.log("User not found");

    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json("Invalid credentials");
        console.log("Invalid credentials");

    
    }

    const token = jwt.sign({id:user._id},JWT_SECRET),{expiresIn:"1h"};
    re.json({token});
});


module.exports = router;