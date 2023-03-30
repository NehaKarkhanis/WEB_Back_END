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
app.use("/posts", require("./routes/posts"));
app.use("/appointments", require("./routes/appointments"));
app.use("/subscription", require("./routes/subscription"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
