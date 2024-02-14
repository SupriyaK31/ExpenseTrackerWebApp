const Sequelize=require('sequelize');

const sequelize=new Sequelize('expensetrackerdb','root','pass',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;
