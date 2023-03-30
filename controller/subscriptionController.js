const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../db/conn");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

exports.manageSubscription = async (req, res) => {
  const res_id = req.body.res_id;
  const email = req.body.email;
  const action = req.body.action;

  if (action === "subscribe") {
    try {
      const db = await connectToDatabase();
      const usersCollection = await db.collection("users");

      const result = await usersCollection.updateOne(
        { email: email, subscribed_restaurants: { $ne: res_id } },
        { $addToSet: { subscribed_restaurants: res_id } }
      );
      console.log(result);
      if (result.modifiedCount === 0) {
        return res.status(400).send({
          message: "Already subscribed or no such restaurant exists!",
        });
      }
      return res.status(200).send({
        message: "Subscribed Successfully!",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server error!",
      });
    }
  } else if (action === "unsubscribe") {
    try {
      const db = await connectToDatabase();
      const usersCollection = await db.collection("users");
      const result = await usersCollection.updateOne(
        { email: email },
        { $pull: { subscribed_restaurants: res_id } }
      );
      console.log(result);
      if (result.modifiedCount === 0) {
        return res.status(400).send({
          message: "No such restaurant exists!",
        });
      }
      return res.status(200).send({
        message: "Unsubscribed successfully!",
      });
    } catch (err) {
      res.status(500).send({
        message: "Internal server error!",
      });
    }
  } else {
    return res.status(400).send({
      message: "Invalid operation!",
    });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  const email = req.body.email;
  try {
    const db = await connectToDatabase();
    const user = await db.collection("users").find({ email: email }).toArray();
    return res.status(200).send({
      subscribed_restaurants: user[0].subscribed_restaurants,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Internal server error!",
    });
  }
};
