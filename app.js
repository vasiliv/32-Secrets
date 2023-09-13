//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});
// const userSchema = {
//     email: String,
//     password: String
// }
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});
//moved to .env file
//const secret = "Thisisourlittlesecret.";
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));

app.get("/", async (req, res) => {
    res.render("home");
});

app.get("/login", async (req, res) => {
    res.render("login");
});

app.get("/register", async (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    await newUser.save().then(res.render("Secrets"));
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;   
    try{
        const foundUser = await User.findOne({email: username});
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }else{
                res.send("Wrong password");
            }
        }else{
            res.send("Such user does not exists");
        }        
    }
    catch(error) {
        res.send(error);
    }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});