const express=require('express');
const cors = require('cors');

const sequelize=require('./utils/database');
const userRoutes=require('./routes/userRoute');
const purchaseRoutes=require('./routes/purchaseRoutes');
const expenseRoutes=require('./routes/expenseRoute');
const forgetPassRoutes=require('./routes/forgetpassword');

const User=require('./models/user');
const Expense=require('./models/expenseModel');
const Order = require('./models/order');
const Forgotpassword=require('./models/forgetPassword');

const app=express();
const PORT=3000;
const dotenv=require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(userRoutes);
app.use(purchaseRoutes);
app.use(expenseRoutes);
app.use(forgetPassRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync().then(()=>{
    app.listen(PORT,()=>{ 
        console.log(`server is running on https://localhost:${PORT}`);
    });
})

