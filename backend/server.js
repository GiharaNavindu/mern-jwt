const expres = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



const app = express(); //new express app is initialized
app.use(bodyParser.json());//middleware to parse json request bodies
//extracts the JSON payload from incoming requests and makes it accessible under req.body in your route handlers
app.use(cors());//enable cross-origin resource sharing


// MongoDB connection
mongoose.connect("mongodb://localhost:27017/mern-jwt-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

//User Schema

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
  });

  const User = mongoose.model("User", userSchema);
  
  // JWT secret key
  const JWT_SECRET = "secret";

  //Signup

  app.post("/signup",async(req,res)=>{
    const {username,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    try{
        await User.create({username,password:hashedPassword});
        res.status(201).json("User created successfully");
    }
  })