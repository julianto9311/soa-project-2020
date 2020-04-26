const express = require("express");
const mysql = require("mysql");
const app = express();

app.use(express.urlencoded({extended:true}));

app.listen(3000,function(req,res){
    console.log("Listening to Port 3000");
});