//Created by Lav Patel (B00910579)
const { connectToDatabase } = require('../db/conn');
const { request } = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

exports.get_volunteer_list = async (request, response) => {
    try {
        const db = await connectToDatabase();
        //get email from headers to authenticate the user
        const email = request.headers.email;
        if (!email) {
            return response.status(401).json({ error: true, message: 'unauthorized' });
        } 
        //check if the restaurant email exists
        const restaurantsCollection = db.collection('restaurants');
        const restaurant = await restaurantsCollection.findOne({ _id: email });
        if (!restaurant) {
          return response.status(401).send({ error:true , message: 'unauthorized' });
        }
        //get all volunteers from db 
        const volunteers = await db.collection('volunteers').find().toArray()
        return response.send(volunteers);
    } catch (error) {
        console.error(error);
        return response.status(503).json({
            "message": "Internal Server Error"
        });
    }
};