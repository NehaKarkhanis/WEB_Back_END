const express = require("express");
const user_router = express.Router();

const user_controller = require('../controller/userController');

user_router.get('/', user_controller.get_user_list);
user_router.post('/register', user_controller.post_user_signup);
user_router.post('/checkEmail', user_controller.post_existing_email_chk);
user_router.post('/login', user_controller.post_validateUser);
user_router.get('/:email', user_controller.get_user_details);
user_router.put('/update', user_controller.put_update_user);

module.exports = user_router;