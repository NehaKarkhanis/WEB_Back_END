const { connectToDatabase } = require('../db/conn');
const { request } = require('express');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

exports.get_volunteer_list = async (request, response) => {
    try {
        const db = await connectToDatabase();
        const volunteers = await db.collection('volunteers').find().toArray()
        return response.send(volunteers);
    } catch (error) {
        console.error(error);
        return response.status(503).json({
            "message": "Internal Server Error"
        });
    }
};