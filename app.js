const express=require('express');
const sequelize=require('./utils/database');
const userRoutes=require('./routes/userRoute');
const purchaseRoutes=require('./routes/purchaseRoutes');
const cors = require('cors');
const app=express();
const PORT=3000;
const User=require('./models/user');
const Expense=require('./models/expenseModel');
const Order = require('./models/order');
app.use(cors());

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(userRoutes);
app.use(purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync().then(()=>{
    app.listen(PORT,()=>{ 
        console.log(`server is running on https://localhost:${PORT}`);
    });
})

