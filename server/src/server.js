const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config();

const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const examRoutes = require("./routes/examRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const chatRoutes = require("./routes/chatRoutes");
const projectRoutes = require("./routes/projectRoutes");
const seedRoutes = require("./routes/seedRoutes");
const searchRoutes = require("./routes/searchRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const profileRoutes = require("./routes/profileRoutes");
const higherEdRoutes = require("./routes/higherEdRoutes");

const app = express();

// ──────────────────────────────────────
// SECURITY & MIDDLEWARE
// ──────────────────────────────────────

// Helmet — security headers
app.use(helmet());

// Gzip compression
app.use(compression());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per window
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parsing
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ──────────────────────────────────────
// ROUTES
// ──────────────────────────────────────

// Root route — welcome page
app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "CareerX API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth (signup, login, logout, forgot-password, reset-password)",
      users: "/api/users (profile, stats, activity, achievements)",
      dashboard: "/api/dashboard (summary, leaderboard)",
      resumes: "/api/resumes (CRUD, ATS analysis)",
      jobs: "/api/jobs (search, apply, applications)",
      interviews: "/api/interviews (practice sessions, history)",
      exams: "/api/exams (subjects, start, submit, history)",
      compiler: "/api/compiler (problems, run code, submit, stats)",
      chat: "/api/chat (AI career assistant sessions)",
      projects: "/api/projects (AI project lab, templates, steps)",
    },
    docs: "Use the endpoints above with proper HTTP methods",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerX API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/uploads", express.static(path.join(__dirname, "../uploads"), {
  setHeaders: (res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
  },
}));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/coding-profile", profileRoutes);
app.use("/api/higher-ed", higherEdRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// ──────────────────────────────────────
// START SERVER
// ──────────────────────────────────────

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════╗
║      CareerX API Server              ║
║──────────────────────────────────────║
║  Port:        ${PORT}                    ║
║  Environment: ${(process.env.NODE_ENV || "development").padEnd(19)} ║
║  API:         http://localhost:${PORT}   ║
╚══════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
