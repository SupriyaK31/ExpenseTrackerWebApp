const express=require('express');
const routes=express.Router();
const path=require('path');
const User=require('../models/user');

routes.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','Signup.html'));
})
routes.post('/Signup',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password=req.body.password;
    const user=User.create({
        name:name,
        email:email,
        password:password
    }).then((result)=>{
        console.log(result);
        console.log('Signup Successful');
    }).catch((err)=>{console.log(err)})
});

module.exports=routes;