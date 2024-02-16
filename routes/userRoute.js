const express=require('express');
const routes=express.Router();

const userController=require('../controllers/userController');
const expenseController=require('../controllers/expenseController');

routes.get('/',userController.getIndex);
routes.get('/login',userController.getLogin);
routes.post('/Signup',userController.postSignup);
routes.post('/Login',userController.postLogin);
routes.get('/expense',expenseController.expensePage);
routes.post('/addExpense',expenseController.addExpense);
routes.get('/showExpense',expenseController.getExpenseList);
module.exports=routes;