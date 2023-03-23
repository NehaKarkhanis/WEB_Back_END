const express = require('express');
const { connectToDatabase } = require('../db/conn');
const bcrypt = require('bcrypt');
const { connect } = require('../routes/users');


exports.get_user_list = async (request, response) => {
    try {
        const db = await connectToDatabase();
        const users = await db.collection('users').find().toArray();
        return response.status(200).json({
            "message": "Users retrieved",
            "users": users
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            "message": "Internal Server Error"
        });
    }
};

exports.get_user_details = async (request, response) => {
    try {
        const db = await connectToDatabase();
        const user = await db.collection('users').findOne({
            email: request.params.email
        });
        if (user) {
            return response.status(200).json({
                fname: user.fname,
                lname: user.lname,
                email: user.email
            });
        } else {
            return response.status(400).json({
                "message": 'No user details found'
            });
        }
    } catch (error) {
        console.error(error);
    }
}

exports.post_user_signup = async (request, response) => {
    try {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(request.body.password, salt, async function (err, password_hash) {
                const db = await connectToDatabase();
                db.collection('users').insertOne({
                    "fname": request.body.fname,
                    "lname": request.body.lname,
                    "email": request.body.email,
                    "password": password_hash
                });
                return response.status(200).json({
                    "message": "Registration Success"
                });
            });
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            "message": "Internal Server Error"
        });
    }
};

exports.post_existing_email_chk = async (request, response) => {
    try {
        const db = await connectToDatabase();
        db.collection('users').findOne({
            'email': request.body.email
        }).then(user => {
            if (user) {
                return response.status(400).json({
                    "message": "Email already exists"
                })
            } else {
                return response.status(200).json({
                    "message": "No email exists"
                })
            }
        })
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            "message": "Internal Server Error"
        });
    }
};

exports.post_validateUser = async (request, response) => {
    try {
        const db = await connectToDatabase();
        db.collection('users').findOne({ 'email': request.body.email })
            .then(user => {
                if (user) {
                    bcrypt.compare(request.body.password, user.password)
                        .then(isMatch => {
                            if (isMatch) {
                                return response.status(200).json({
                                    'message': 'Authentication successful'
                                })
                            } else {
                                return response.status(400).json({
                                    'message': 'Invalid User'
                                })
                            }
                        })
                } else {
                    return response.status(400).json({
                        'message': 'Invalid user'
                    })
                }
            }
            )
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            "message": "Internal Server Error"
        });
    }
};

exports.put_update_user = async (request, response) => {
    try {
        console.log(request.body);
        const db = await connectToDatabase();
        db.collection('users').
            updateOne({ email: request.body.email }, { $set: { fname: request.body.fname, lname: request.body.lname } });
        return response.status(200).json({
            'message': 'User Updated'
        });
    } catch (error) {
        return response.status(500).json({
            'message': 'Internal Server Error'
        });
    }
};