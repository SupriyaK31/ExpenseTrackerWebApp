const express=require('express');
const routes=express.Router();

const expenseController=require('../controllers/expenseController');
const userAuth=require('../middleware/auth');

routes.get('/expense',expenseController.expensePage);
routes.post('/addExpense',userAuth.authonticate,expenseController.addExpense);
routes.get('/showExpense',userAuth.authonticate,expenseController.getExpenseList);
routes.delete('/delExpense/:id',expenseController.delExpense);

module.exports=routes;