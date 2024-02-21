const express=require('express');
const routes=express.Router();

const orderController=require('../controllers/orderController');
const userAuth=require('../middleware/auth');

routes.get('/purchase/premimummember',userAuth.authonticate,orderController.purchasePremium);
routes.post('/purchase/updatetransactionstatus',userAuth.authonticate,orderController.updateTransactionStatus);
module.exports=routes;