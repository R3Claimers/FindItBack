const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/database");
const { initializeFirebase } = require("./config/firebase");
const errorHandler = require("./middlewares/errorHandler");

const userRoutes = require("./routes/userRoutes");
const { createItemRoutes } = require("./routes/itemRoutes");
const matchRoutes = require("./routes/matchRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "https://finditback.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

initializeFirebase();
connectDB();

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "FindItBack API is running",
    timestamp: new Date().toISOString(),
  });
});

const API_PREFIX = process.env.API_PREFIX || "/api/v1";
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/lost-items`, createItemRoutes("lost"));
app.use(`${API_PREFIX}/found-items`, createItemRoutes("found"));
app.use(`${API_PREFIX}/matches`, matchRoutes);
app.use(`${API_PREFIX}/comments`, commentRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API Base: ${API_PREFIX}`);
});

module.exports = app;
