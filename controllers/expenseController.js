
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
        const Amount = req.body.Amount;
        console.log("req.body"+Amount);
        const description = req.body.description;
        const category=req.body.category;
       await Expense.create({Amount,description,category}).then((result)=>{
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
        await Expense.findAll({ where: {userId: req.user.id}}).then(expenses=>{
            return res.status(200).json({expenses,sucess:true});
        }).catch(err=>{console.log(err);})
        // console.log(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

}

const delExpense=async(req,res)=>{
    const expenseId = req.params.id;
    // console.log('expenseID:'+ expenseId);
    try{
        const expense= await Expense.findByPk(expenseId);
        // console.log(expense);
        if(!expense){
            return res.status(404).json({error:'Expense not Found'});
        }
        await expense.destroy();
        res.status(201).json({message:'Expense deleted sucessfully'});

    }catch(error){
        res.status(500).json({error:'Internal Server Error'});
    }
    
};
module.exports={
    expensePage,
    addExpense,
    getExpenseList,
    delExpense
}