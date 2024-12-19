const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:stringify,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});


module.exports =mongoose.model("User",userSchema);