const express = require("express");
const postsRouter = express.Router();

const postsControlller = require("../controller/postsController");

// get posts from every restaurant
postsRouter.get("/", postsControlller.getAllPosts);

// get posts from specific restaurant
postsRouter.post("/", postsControlller.getPostsByResID);

module.exports = postsRouter;
