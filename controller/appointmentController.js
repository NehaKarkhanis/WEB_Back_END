const { connectToDatabase } = require("../db/conn");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// add and retrieve appointments

exports.getAllappointements = async (req, res) => {
  try {
    const db = await connectToDatabase();
    console.log(req.params.id);
    const user_id = req.params.id;
    const users = await db.collection("users").find().toArray();
    console.log(users);
    const user = users.find((user) => {
      return user._id.toString() === user_id;
    });
    if (user) {
      return res.status(200).json({
        message: "Appointments retrieved",
        appointments: user.appointments,
      });
    } else {
      return res.status(400).json({
        message: "No such user exists!",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.addAppointment = async (req, res) => {};
