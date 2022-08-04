const express = require('express')
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { uuid } = require('uuidv4');

let env = require('dotenv');
env.config();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //This will define where we want to store our file
        //1. OUr Own Server
        //2. 3rd Party Server
        //console.log(file);

        //You have to access the file adress
        console.log(file);
      
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let random = uuid();
        let filename = random+""+file.originalname;
       
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

//Connect to mongodb

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_DB}.dgmru.mongodb.net/?retryWrites=true&w=majority`).then((d)=>{
    //Success
    console.log('Conneted');
}).catch((e)=>{
    //Error
});

//PO.then().catch().finally();

app.post('/fileupload', upload.single('mypic'),(req,res)=>{

    //console.log(req.file);

    cloudinary.uploader.upload(req.file.path,function(error, result) {
        console.log(result, error);
        if(error && Object.keys(error).length === 0 && Object.getPrototypeOf(error) === Object.prototype){
            //Error
            res.status(400).json({
                msg:"Error",
                error:error
            });
        }else{
            //Success
            res.status(200).json({
                msg:"FIle uploaded successfully",
                d:result
            });
        }
       
        
    });   
    
});




let portno = process.env.PORT || 5000;
app.listen(portno,()=>{
    console.log(`listening on port ${portno} `)
});