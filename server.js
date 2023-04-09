//Created by Viraj Joshi
//Updated By Arpit Ribadiya (B00932018)
//Updated by Neha Karkhanis
//Updated by Lav Patel (B00910579)

// Import required packages and files
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectToDatabase } = require("./db/conn");
require("dotenv").config();

// Set up middleware
app.use(bodyParser.json());
app.use(cors());

// Call connectToDatabase() function from conn.js file
const db = connectToDatabase();

// Set up routes
app.use("/users", require("./routes/users"));
app.use("/restaurants", require("./routes/restaurants"));
app.use("/volunteers", require("./routes/volunteers"));
app.use("/restaurantorders", require("./routes/restaurantOrders"));
app.use("/restaurant/volunteers", require("./routes/restaurantVolunteers"));
app.use("/subscription", require("./routes/subscription"));
<<<<<<< HEAD
app.use("/admin", require("./routes/admin"));
=======
app.use("/posts", require("./routes/posts"));
>>>>>>> origin/main

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
