require('dotenv').config();
const Contact = require('./contactModel');
const express=require('express')
const multer=require('multer')
const path=require('path')
const cookieParser = require('cookie-parser')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer=require('nodemailer');
const logger=require('../controller/logger')


const app=express()
app.use(cookieParser())

// This Route For Registration

exports.new =async   function (req, res) {
    try{
    var contact = new Contact();
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.gender = req.body.gender;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.password=req.body.password;

// Ganerate JWT TOKEN when we user register
    
    const token=await contact.ganerateAuthToken()
    contact.save(function (err) {
            res.json({
            message: 'New contact created!',
            data: contact
        });
        
    });
    logger.info(`response ${contact}`)
    logger.info("successfully done registration ")
}
catch(error){
        res.json({
        message: 'please fill the all correct details',
    });
    logger.error("error find in registration time")
}
}

// This Route for login

exports.login= async(req,res)=>{
        try{
            const  email=req.body.email;
            const  password=req.body.password;
            const user=await Contact.findOne({email:email})
            const isMatch=await bcrypt.compare(password,user.password)

// Ganerate JWT TOKEN when user login

            const token=await user.ganerateAuthToken()

// cookie
            res.cookie("jwt",token,{
            expires:new Date(Date.now()+1000),
            httpOnly:true
        });
        if(isMatch){
            res.json({
            message: 'You successfully login',
            data: user
            });
            logger.info(`successfully login ${res}`)
        }else{
            res.json({
            message: 'Invalid Password Details',
            });
        }
        logger.error("Error find in login time ")
    }
    catch(error){
        return res.send(error)
        
    }
    
}
        

// Send email functionality using SMTP


let mailTransporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
        user: 'shadabakhtar476@gmail.com',
		pass: 'razaraza'
	}
});
exports.sentMail= async(req,res)=>{
    email=req.body.email;
    const user=await Contact.findOne({email:email})
    try{
                            
                            
            if(user){
           
                    var mailOptions= {
                    to: req.body.email,
                    subject: "Email for check mail sent or not: ",
                    html: "<h3>Email for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" +" http://localhost:4000/email-Verification="+req.body.email +"</h1>" // html body;
                };
                    mailTransporter.sendMail(mailOptions, (error, info) => {
            
                    console.log('Message sent: %s', info.messageId);   
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    logger.info(`successfully done email ${res}`)
                    res.json({
                    message: 'Your mail sent successfully',
                                 });
                                 
                            });
                   
            }else{
                logger.error("something went wrong")
                    res.json({
                        
                    message: 'Please Enter the valid email address',
                });
                
               
        }
        }catch(err){
                
                 
        }
    };


    // upload Image
    
    app.use('/profile',express.static('upload/images'))
    exports.uploadFile= (req,res)=>{
        
    res.json({
       success:1,
       profile_url:`http://loacalhost:4000/profile/${req.file.filename}`,
        });
        console.log(req.file)
}
    function errHandler(err,req,res,next){
        if(err instanceof multer.MulterError){
        res.json({
            success:0,
            message:err.message
        })
    }
}
app.use(errHandler)




