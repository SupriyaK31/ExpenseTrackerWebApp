const User=require('../models/user');
const Expense=require('../models/expenseModel');
const {Sequelize}=require('sequelize');
const path=require('path');
const bcrypt=require('bcrypt');
const sequelize = require('../utils/database');
const AWS=require('aws-sdk');
const File=require('../models/expenseFile');
const expensePage=(req,res)=>{
 res.sendFile(path.join(__dirname,'../','views','index.html'));
};

function isstringValidator(string){
    if(string =='undefine' || string.length===0){
        return true;
    }else{
        return false;
    }
}

const addExpense= async(req,res)=>{
    try{
        const t=await sequelize.transaction();
        const Amount = req.body.Amount;
        const userId=req.user.id;
        // console.log("req.body"+userId);
        const description = req.body.description;
        const category=req.body.category;
        await Expense.create({Amount,description,category,userId},{transaction:t}).then(async(expense)=>{
            // console.log("total expense"+Number(req.user.totalExpenses));
        const totalExpense=Number(req.user.totalExpenses)+Number(Amount);
        console.log(totalExpense);
        await User.update({
            totalExpenses:totalExpense
        },{
            where:{id:req.user.id},
            transaction:t
       }).then(async()=>{
        await t.commit();
        res.status(200).json({expense:expense});
       }) 
       }).catch(async(err)=>{
         await t.rollback();
        res.status(402).json('Not Found');
       })
    }catch(error){
     await t.rollback();
        console.error(error);
        res.status(500).json('internal server issue');
    }
};
const getExpenseList = async (req, res) => {
    try {
      const page = req.query.page || 1; // Default to page 1 if not provided
      const pageSize = 5; // Number of records per page
  
      const offset = (page - 1) * pageSize;
  
      const result = await Expense.findAndCountAll({
        where: { userId: req.user.id },
        offset: offset,
        limit: pageSize,
      });
  
      const expenses = result.rows;
      const totalCount = result.count;
  
      const totalPages = Math.ceil(totalCount / pageSize);
  
      return res.status(200).json({
        expenses,
        totalCount,
        totalPages,
        currentPage: page,
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
const delExpense = async (req, res) => {
    const expenseId=req.params.id;
    try {
        const t=await sequelize.transaction();
        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        if (!expense) {
            return res.status(404).json({ error: 'Expense not Found' });
        }
        const totalExpense = Number(req.user.totalExpenses) - Number(expense.Amount);
        
        await Expense.destroy({ where: { id: expenseId, userId: req.user.id } },{transaction:t}).then(async()=>{
        
        await User.update({ totalExpenses: totalExpense }, 
            { 
                where: { id: req.user.id },
                transaction:t
            }).then(async()=>{
                await t.commit();
                res.status(201).json({ message: 'Expense deleted successfully' });
            }).catch(async(error)=>{
                await t.rollback();
                res.status(404).json({ error: 'not found' });
            })
        })
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

function uploadToS3(data,filename){
    const BUCKET_NAME='supriyaexpensetracker';
    const IAM_USER_KEY='AKIAZI2LDPW3ABQQ33RL';
    const IAM_USER_SECRET='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';

    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        // Bucket:BUCKET_NAME
    })
 
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body: data,
            ACL:'public-read'      //Access control level
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log('something went wrong',err);
                    reject(err);
                }else{
                    console.log('Success',s3response);
                    resolve(s3response.Location);
                }
            })
        });

}
const downloadExpenses =  async (req, res) => {

    try {
        // if(!req.user.ispremiumuser){
        //     return res.status(401).json({ success: false, message: 'User is not a premium User'})
        // }
        const expenses=await req.user.getExpenses();
       
        const stringifyExpenses=JSON.stringify(expenses);
        
        const userId=req.user.id;
        const filename=`Expense${userId}/${new Date()}.txt`;
        const fileURL= await uploadToS3(stringifyExpenses,filename);
        console.log('file url',fileURL);
        File.create({fileURL,userId});
        res.status(200).json({fileURL,success:true});
        // const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
        // // Create the BlobServiceClient object which will be used to create a container client
        // const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // // V.V.V.Imp - Guys Create a unique name for the container
        // // Name them your "mailidexpensetracker" as there are other people also using the same storage

        // const containerName = 'prasadyash549yahooexpensetracker'; //this needs to be unique name

        // console.log('\nCreating container...');
        // console.log('\t', containerName);

        // // Get a reference to a container
        // const containerClient = await blobServiceClient.getContainerClient(containerName);

        // //check whether the container already exists or not
        // if(!containerClient.exists()){
        //     // Create the container if the container doesnt exist
        //     const createContainerResponse = await containerClient.create({ access: 'container'});
        //     console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
        // }
        // // Create a unique name for the blob
        // const blobName = 'expenses' + uuidv1() + '.txt';

        // // Get a block blob client
        // const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // console.log('\nUploading to Azure storage as blob:\n\t', blobName);

        // // Upload data to the blob as a string
        // const data =  JSON.stringify(await req.user.getExpenses());

        // const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        // console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

        // //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
        // const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
        //  res.status(201).json({message: expense}); // Set disposition and send it.
    } catch(err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
    }

};
const downloadedFile= (req,res)=>{
    try{
        const filelist=File.findAll({where : { id:req.user.id}});
        console.log(filelist);

    }catch(err){
        console.log(err);
    }
}

module.exports={
    expensePage,
    addExpense,
    getExpenseList,
    delExpense,
    downloadExpenses,
    downloadedFile

}