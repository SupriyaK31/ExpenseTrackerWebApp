const User=require('../models/user');
const Expense=require('../models/expenseModel');
const {Sequelize}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const getIndex=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','Signup.html'));
};

const getLogin=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'));
};
function generateToken(id,name){
    return jwt.sign({userId:id, name:name},'98789d8cedf9');
}
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
        const saltround=10;
        bcrypt.hash(password,saltround,async(err,hash)=>{
             console.log(err);
             await User.create({name,email,password:hash})
             .then((result)=>{
                console.log(result);
                console.log('Signup Successful');
                //  res.status(201).json(result);
                 res.redirect('/login');
            })       
            //  .catch((error)=>{
            //     if(error instanceof Sequelize.UniqueConstraintError){
            //         res.status(400).json({ err: 'Email already exists' });
            //     }else{
            //         res.status(500).json({ err: 'Internal Server Error' });
            //     }
            // })
        })

    }catch(err){
        console.log(err);
    } 
};

const postLogin=async(req,res)=>{
   const { email,password}=req.body;
  try{
   const user= await User.findAll({
    where:{
        email,
    },
   })
   if(user.length>0){
    bcrypt.compare(password,user[0].password,(err,result)=>{
        if(!err){
           return res.status(200).json({message:'login Sucessful',token: generateToken(user[0].id,user[0].name)});
        //    res.redirect('/expense');
        }else{
            res.status(401).json({error:'User not authorized'});
        }
    })
   }else{
    res.status(401).json({error: 'User not found'});
   }
  }catch(error){
    console.error(error);
    res.status(500).json({error:'Internal Server Error'});

  }
};

module.exports={
    getIndex,
    getLogin,
    postSignup,
    postLogin,
  }