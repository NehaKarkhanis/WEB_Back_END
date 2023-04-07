//Created by Lav Patel
const express = require("express");
const { connectToDatabase } = require("../db/conn");
const bcrypt = require("bcrypt");
const { connect } = require("../routes/users");
const nodemailer = require("nodemailer");
const { request } = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });



exports.post_validateAdmin = async (request, response) => {
  try {
    const db = await connectToDatabase();
    let email=request.email;
    let password=request.password;
    if (email===""||password===""){
        return response.status(400).json({
            error:true,
            message: "Bad request",
          });
    }
    db.collection("admin")
      .findOne({ _id: request.body.email })
      .then((user) => {
        if (user) {
          bcrypt
            .compare(request.body.password, user.password)
            .then((isMatch) => {
              if (isMatch) {
                return response.status(200).json({
                  message: "Authentication successful",
                });
              } else {
                return response.status(401).json({
                  message: "Invalid User",
                });
              }
            });
        } else {
          return response.status(401).json({
            message: "Invalid user",
          });
        }
      });
  } catch (error) {
    console.error(error);
    return response.status(503).json({
      message: "Internal Server Error",
    });
  }
};

exports.get_pending_restaurantApplication = async (request, response) => {
    try {
        const email = request.headers.email;
        if (!email) {
            return response.status(401).json({ error: true, message: 'unauthorized' });
        }
        const db = await connectToDatabase();
        const adminCollection = db.collection('admin');
        const restaurantCollection = db.collection('restaurants');
        //check if the admin exists to allow further processing
        const admin = await adminCollection.findOne({ _id: email });
        if (!admin) {
          return response.status(401).send({ error:true , message: 'unauthorized' });
        }
        //get the orderdetails of all the orders whose status is 'packed'or 'pending'
        const restaurants = await restaurantCollection
        .find({ isapproved: 0 
        })
        .toArray();
      return response.send(restaurants);
    } catch (error) {
        console.error(error);
        return response.status(503).json({
            "error": true,
            "message": "Internal Server Error"
        });
    }
};
exports.post_change_restaurantApplication_status = async (request, response) => {
    try {
        const email = request.headers.email;
        if (!email) {
            return response.status(401).json({ error: true, message: 'unauthorized' });
        }
        const db = await connectToDatabase();
        const adminCollection = db.collection('admin');
        const restaurantCollection = db.collection('restaurants');
        //check if the admin exists to allow further processing
        const admin = await adminCollection.findOne({ _id: email });
        if (!admin) {
          return response.status(401).send({ error:true , message: 'unauthorized.' });
        }
        //get request params
        const restaurantId = request.params.restaurantId;
        const newStatus = request.body.status;
        if (!restaurantId||!newStatus) {
          return response.status(400).json({ error: true, message: 'bad request.' });
        }
        let newStatusinDb=0;
        if (newStatus==='Approved'){
            newStatusinDb=1;
        }

        // find the restaurant by restaurantId and update its status
        const updateResult = restaurantCollection.updateOne({ _id: restaurantId }, { $set: { status: newStatus } });
        if(!updateResult){
            return response.status(503).json({
                "error": true,
                "message": "Internal Server Error"
            });

        }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "virajj60@gmail.com",
              pass: process.env.gmail_pass,
            },
          });
      
          let emailSubject=""
          let emailBody=""

        if(newStatusinDb===1){
            console.log('Restaurant '+restaurantId+' approved successfully');
            emailSubject="LastServe Restaurant Application Approved"
            emailBody=`Congratulations!,  Your Application is approved , You can start posting right away`
        }
        else{
            emailSubject="LastServe Restaurant Application reject"
            emailBody=`Your Application is rejected , the application has not been filled completely, please try again.`
        }
        const mailOptions = {
            from: "virajj60@gmail.com",
            to: restaurantId,
            subject: emailSubject,
            text: emailBody,
          };

          const info = await transporter.sendMail(mailOptions);
          response.status(204).send();


    } catch (error) {
        console.error(error);
        return response.status(503).json({
            "error": true,
            "message": "Internal Server Error"
        });
    }
};
exports.get_all_post = async (request, response) => {
    try {
        const email = request.headers.email;
        if (!email) {
            return response.status(401).json({ error: true, message: 'unauthorized' });
        }
        const db = await connectToDatabase();
        const adminCollection = db.collection('admin');
        const postCollection = db.collection('posts');
        //check if the admin exists to allow further processing
        const admin = await adminCollection.findOne({ _id: email });
        if (!admin) {
          return response.status(401).send({ error:true , message: 'unauthorized' });
        }
        //get all posts
        const posts = await postCollection
        .find()
        .toArray();
      return response.send(posts);
    } catch (error) {
        console.error(error);
        return response.status(503).json({
            "error": true,
            "message": "Internal Server Error"
        });
    }
};

