const express=require('express');
const sequelize=require('./utils/database');
const userRoutes=require('./routes/route');
const cors = require('cors');
const app=express();
const PORT=3000;
app.use(cors());

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(userRoutes);

sequelize.sync().then(()=>{
    app.listen(PORT,()=>{ 
        console.log(`server is running on https://localhost:${PORT}`);
    });
})

