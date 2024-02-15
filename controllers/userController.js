const User=require('../models/user');
const {Sequelize}=require('sequelize');
const path=require('path');

const getIndex=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','Signup.html'));
};

const getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'));
};

function isstringValidator(string){
    if(string =='undefine' || string.length===0){
        return true;
    }else{
        return false;
    }
}
const postSignup= async(req,res)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password=req.body.password;
        if(isstringValidator(name) || isstringValidator(email) || isstringValidator(password)){
            return res.status(400).json({err:'bad Paramets. Something is missing'})
        }
        const user= await User.create({
            name:name,
            email:email,
            password:password
        }).then((result)=>{
            console.log(result);
            console.log('Signup Successful');
             res.status(201).json(result);
            // res.redirect('/login');
        }).catch((err)=>{
            if(err instanceof Sequelize.UniqueConstraintError){
                res.status(400).json({ err: 'Email already exists' });
            }else{
                res.status(500).json({ err: 'Internal Server Error' });
            }
        })
    }catch(err){
        console.log(err);
    } 
};

module.exports={
    getIndex,
    getLogin,
    postSignup
}