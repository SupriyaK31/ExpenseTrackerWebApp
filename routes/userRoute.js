const express=require('express');
const routes=express.Router();
const path=require('path');
const User=require('../models/user');
const { Sequelize } = require('sequelize');

routes.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','Signup.html'));
})
routes.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'));
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
        // res.status(201).json(result);
        res.redirect('/login');
    }).catch((err)=>{
        if(err instanceof Sequelize.UniqueConstraintError){
            res.status(400).json({ err: 'Email already exists' });
        }else{
            res.status(500).json({ err: 'Internal Server Error' });
        }
    })
});



module.exports=routes;