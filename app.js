//jshint esversion:6
require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
var encrypt = require('mongoose-encryption');
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});
const userSchema= new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedField: ["password"]});

const User=mongoose.model("User",userSchema);
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){

    res.render("home");
});

app.get("/register",function(req,res){
    
    res.render("register");

});
app.get("/login",function(req,res){
    
    res.render("login");

});
app.post("/register",function(req,res){
const newUser=new User({
    email: req.body.username,
    password: req.body.password
});
newUser.save(function(err){
    if(err){
        console.log(err);
    }
    else{
        res.render("secrets");
    }
});
});
app.post("/login",function(req,res){
    const usernames= req.body.username;
    const password= req.body.password;
    User.findOne({email: usernames} ,function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
            }
        }
    });
});


app.listen(3000,function(req,res){
    console.log("The server is running on port 3000");
});