const { connectToDatabase } = require("../db/conn");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// retrieve all posts or based on res_id

exports.getAllPosts = async (req, res) => {
  try {
    const db = await connectToDatabase();
    // console.log(req.params.id);
    const restaurants = await db.collection("restaurants").find().toArray();
    console.log(restaurants);
    const posts = restaurants.map((res) => {
      return { res_email: res._id, posts: res.posts };
    });
    return res.status(200).json({
      message: "Posts retrieved",
      // restaurants: restaurants,
      posts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getPostsByResID = async (req, res) => {
  try {
    const db = await connectToDatabase();
    console.log(req.body.res_id);
    const res_email = req.body.res_email;
    const restaurants = await db.collection("restaurants").find().toArray();
    console.log(restaurants);
    const resPosts = restaurants.find((res) => {
      return res._id === res_email;
    });

    if (resPosts) {
      return res.status(200).json({
        message: "Posts retrieved from restaurant",
        posts: resPosts.posts,
      });
    } else {
      return res.status(400).json({
        message: "No such restaurant exists!",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
