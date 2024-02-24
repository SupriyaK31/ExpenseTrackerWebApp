const User=require('../models/user');
const Expense=require('../models/expenseModel');
const {Sequelize}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const sequelize = require('../utils/database');

function isstringValidator(string){
    if(string =='undefine' || string.length===0){
        return true;
    }else{
        return false;
    }
}

const getAllUserExpense=async(req,res)=>{
    try{
        const userLeaderBoardDetails=await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('coalesce',sequelize.fn('sum', sequelize.col('expenses.Amount')),0), 'totalCost']],
            include:[
                {
                    model:Expense,
                    attributes:[],
                }
            ],
            group:['user.id'],
            order: [[sequelize.col("totalCost"), "DESC"]]
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b)=>b.totalCost-a.totalCost);
        res.status(200).json(userLeaderBoardDetails);
    }catch(error){
        res.status(500).json(error);
        throw new Error(error);
    }

};
module.exports={
    getAllUserExpense
  }