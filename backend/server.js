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
    catch{
        res.status(400).json("Username already exists");
    }
  });



  //signin
  app.post("/signin", async (req, res) => {  
    const { username, password } = req.body; // Corrected 'passowrd' to 'password'  

    // Check if user exists  
    const user = await User.findOne({ username });  
    if (!user) {  
        return res.status(404).json("User not found");  
    }  

    // Validate password  
    const isPasswordValid = await bcrypt.compare(password, user.password); // 'password' was correctly used but needed to ensure consistency  
    if (!isPasswordValid) {  
        return res.status(400).json("Invalid Password"); // Corrected spelling from 'Invlaid' to 'Invalid'  
    }  

    // Create JWT token  
    const token = jwt.sign(  
        {  
            id: user._id,  
        },  
        JWT_SECRET,  
        {  
            expiresIn: "1d",  
        }  
    );  

    res.json({ token });  
});



//dashboard

app.get("/dashboard", async (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Access denied" });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ message: "Welcome to the dashboard!", userId: decoded.id });
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  });
  
  // Start server
  app.listen(5000, () => console.log("Server running on port 5000"));