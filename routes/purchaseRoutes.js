const express=require('express');
const routes=express.Router();

const orderController=require('../controllers/orderController');
const premimumController=require('../controllers/premimumController');
const userAuth=require('../middleware/auth');

routes.get('/purchase/premimummember',userAuth.authonticate,orderController.purchasePremium);
routes.post('/purchase/updatetransactionstatus',userAuth.authonticate,orderController.updateTransactionStatus);
routes.get('/premimum/showAllExpenses',userAuth.authonticate,premimumController.getAllUserExpense);
module.exports=routes;