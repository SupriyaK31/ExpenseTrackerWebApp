const User=require('../models/user');
const Expense=require('../models/expenseModel');
const {Sequelize}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');
const sequelize = require('../utils/database');


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
        const t=await sequelize.transaction();
        const Amount = req.body.Amount;
        const userId=req.user.id;
        // console.log("req.body"+userId);
        const description = req.body.description;
        const category=req.body.category;
        await Expense.create({Amount,description,category,userId},{transaction:t}).then(async(expense)=>{
            // console.log("total expense"+Number(req.user.totalExpenses));
        const totalExpense=Number(req.user.totalExpenses)+Number(Amount);
        console.log(totalExpense);
        await User.update({
            totalExpenses:totalExpense
        },{
            where:{id:req.user.id},
            transaction:t
       }).then(async()=>{
        await t.commit();
        res.status(200).json({expense:expense});
       }) 
       }).catch(async(err)=>{
         await t.rollback();
        res.status(402).json('Not Found');
       })
    }catch(error){
     await t.rollback();
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

const delExpense = async (req, res) => {
    const expenseId=req.params.id;
    try {
        const t=await sequelize.transaction();
        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not Found' });
        }
        const totalExpense = Number(req.user.totalExpenses) - Number(expense.Amount);
        
        await Expense.destroy({ where: { id: expenseId, userId: req.user.id } },{transaction:t}).then(async()=>{
        
        await User.update({ totalExpenses: totalExpense }, 
            { 
                where: { id: req.user.id },
                transaction:t
            }).then(async()=>{
                await t.commit();
                res.status(201).json({ message: 'Expense deleted successfully' });
            }).catch(async(error)=>{
                await t.rollback();
                res.status(404).json({ error: 'not found' });
            })
        })
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports={
    expensePage,
    addExpense,
    getExpenseList,
    delExpense
}