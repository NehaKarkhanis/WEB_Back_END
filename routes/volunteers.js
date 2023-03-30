const express = require("express");
const volunteer_router = express.Router();

const volunteer_controller = require('../controller/volunteerController');

volunteer_router.get('/', volunteer_controller.get_volunteer_list);

module.exports = volunteer_router;