require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("express-xss-sanitizer");
const hpp = require("hpp");

// Import routers
const usersRouter = require("./routers/usersRouter");
const postsRouter = require("./routers/postRouter");

// Import middlewares
const errorHandler = require("./middlewares/errorHandler");
const rateLimiter = require("./middlewares/rateLimiter");

const app = express();

// Security middlewares
app.use(helmet()); // Set security HTTP headers
app.use(rateLimiter); // Rate limiting
app.use(express.json({ limit: "10kb" })); // Body parser with size limit
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Prevent parameter pollution

app.use(cors());

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
