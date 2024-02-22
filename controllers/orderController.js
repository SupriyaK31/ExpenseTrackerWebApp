const Order = require('../models/order');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_test_FqOJIiOn75ptM5',
    key_secret: 'nuUD1o4MqHvIOnNbvf1093p8'
  });
const purchasePremium = async (req, res) => {
        console.log(razorpay);
        const orderOptions = {
            amount: 2500,  // amount in paise 
            currency: 'INR',
          };
          razorpay.orders.create(orderOptions, (err, order) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Failed to create Razorpay order', error: err });
              // Handle error
            } else {
             req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(()=>{
                res.status(201).json({ order, key_id: razorpay.key_id }); // Include key_id in the response
             }).catch(err=>{
                throw new Error(err);
             })                    
            } 
          });
};

const updateTransactionStatus =(req, res) => {
    try {
        const { payment_id, order_id } = req.body;
       Order.findOne({ where: { orderid: order_id } }).then((order)=>{
        order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }).then(() => {
            req.user.update({ispremiumuser:true}).then(()=>{
                return res.status(201).json({success:true,message:'Transaction Sucessfull'});
            }).catch(err=>console.log(err));
        })
       })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Something went wrong', error });
    }
};
module.exports = {
    purchasePremium,
    updateTransactionStatus
};
