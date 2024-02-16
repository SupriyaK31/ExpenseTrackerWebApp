
const Expense=require('../models/expenseModel');
const {Sequelize}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');


const expensePage=(req,res)=>{
 res.sendFile(path.join(__dirname,'../','views','index.html'));
};
function isstringValidator(string){
    if(string =='undefine' || string.length===0){
        return true;
    }else{
        return false;
    }
}

const addExpense= async(req,res)=>{
    try{
        const amount = req.body.amount;
        console.log(req.body);
        const description = req.body.description;
        const category=req.body.category;
       await Expense.create({amount,description,category}).then((result)=>{
        console.log(result);
        res.status(201).json({err: 'expense added '});
       }).catch((err)=>{
        res.status(402).json('Not Found');
       })
    }catch(error){
        console.error(error);
        res.status(500).json('internal server issue');
    }
};
const getExpenseList= async(req,res)=>{
    try{
        const expenses=await Expense.findAll();
        // console.log(expenses);
        res.json(expenses);
        // console.log(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

}
module.exports={
    expensePage,
    addExpense,
    getExpenseList
}