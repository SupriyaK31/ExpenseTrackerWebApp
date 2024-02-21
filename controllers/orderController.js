
const Order=require('../models/order');
const {Sequelize, or}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');
const razorpay=require('razorpay');

const purchasePremium = async (req, res) => {
    try {
        const rzp = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to create Razorpay order', error: err });
            }

            try {
                const createdOrder = await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
                res.status(201).json({ order, key_id: rzp.key_id });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Failed to create order in the database', error });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};
const updateTransactionStatus=(req,res)=>{
    try{
        const {payment_id,order_id}=req.body;
        Order.fineOne({where :{order_id:order_id}}).then(order=>{
            order.update({paymentid:payment_id,status:'SUCCESSFUL'}).then(()=>{
                return res.status(202).json({sucess:true,message:'Transaction Successful'});
            }).catch((er)=>{
                throw new Error(er);
            })
        }).catch((err)=>{
            Order.update({paymentid:payment_id,status:'Failed'})
        })
    }catch(error){
        console.error(error);
        
    }
}

module.exports={
    purchasePremium,
    updateTransactionStatus
}
