require("dotenv").config();

const postsRouter = require("./routers/postRouter");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routers/usersRouter");
const app = express();

// middleware to parse json body
app.use(express.json());
app.use(cors());

// routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => console.log("✅✅ Connected to MongoDB"))
    .catch((err) => console.error("❌❌ Error connecting to MongoDB", err));
});
