const express =  require("express");
const router  = express.Router();
const jwt  =  require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys");

router.get("dashboard",async(req,res)=>{
    const token = req.headers["authorization"];
    if(!token){
        return res.status(401).json("Access denied");
    }


    try{
        const decoded =  jwt.verify(token,JWT_SECRET);
        res.json({meassage:"Protected route",userId:decoded.id});
        console.log("Welcome to the Dashboard");
    }

    catch{
        res.status(401).json("Invalid token");
        console.log("Invalid token");
    }
});


module.exports = router;
