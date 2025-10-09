require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routers
const usersRouter = require("./routers/usersRouter");
const postsRouter = require("./routers/postRouter");

// Import middlewares
const errorHandler = require("./middlewares/errorHandler");
const rateLimiter = require("./middlewares/rateLimiter");

const app = express();

// middleware to parse json body
app.use(express.json());
app.use(cors());
app.use(rateLimiter);

// routes
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// error middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => console.log("✅✅ Connected to MongoDB"))
    .catch((err) => console.error("❌❌ Error connecting to MongoDB", err));
});
