const User=require('../models/user');
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
        const userId=req.user.id;
        // console.log("req.body"+userId);
        const description = req.body.description;
        const category=req.body.category;
        Expense.create({Amount,description,category,userId}).then((expense)=>{
            // console.log("total expense"+Number(req.user.totalExpenses));
        const totalExpense=Number(req.user.totalExpenses)+Number(Amount);
        console.log(totalExpense);
        User.update({
            totalExpenses:totalExpense
        },{where:{id:req.user.id}
       }).then(async()=>{
        res.status(200).json({expense:expense});
       }) 
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
        if(expenseId== undefined || expenseId.length===0){
            return res.status(400).json({error:'Expense not Found'});
        }
        Expense.destroy({where:{id:expenseId,userId:req.user.id}}).then((noofrows)=>{
            if(noofrows===0){
                return res.status(404).json({error:'Expense not Found'});
            }
            const totalExpense=Number(req.user.totalExpenses)-Number(Amount);
            User.update({
                totalExpenses:totalExpense
            },{where:{id:req.user.id} })
            res.status(201).json({message:'Expense deleted sucessfully'});
              })
        }
    catch(error){
        res.status(500).json({error:'Internal Server Error'});
    }  
};
module.exports={
    expensePage,
    addExpense,
    getExpenseList,
    delExpense
}