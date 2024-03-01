const express=require('express');
const routes=express.Router();

const userController=require('../controllers/userController');

const userAuth=require('../middleware/auth');

routes.get('/',userController.getIndex);
routes.get('/login',userController.getLogin);
routes.post('/Signup',userController.postSignup);
routes.post('/Login',userController.postLogin);
routes.get('/user/download',userAuth.authonticate, userController.downloadFile);
module.exports=routes;