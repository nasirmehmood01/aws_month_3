const express = require("express");
const os = require("os");

const app = express();

const PORT = process.env.PORT || 3000;
const START_TIME = new Date().toISOString();

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  console.log(`Running default URL`);
  res.json({
    message: "Node API is running",
    instanceHostname: os.hostname(),
    uptimeSeconds: process.uptime(),
    startTime: START_TIME
  });
});

// Health check route for ALB / ASG
app.get("/health", (req, res) => {
  console.log(`Running health URL`);
  res.status(200).json({
    status: "ok",
    instanceHostname: os.hostname(),
    uptimeSeconds: process.uptime()
  });
});

// Extra route to identify which instance handled the request
app.get("/instance", (req, res) => {
  console.log(`Running instance URL`);
  res.json({
    hostname: os.hostname(),
    platform: os.platform(),
    cpus: os.cpus().length,
    uptimeSeconds: process.uptime(),
    memoryFreeMB: Math.round(os.freemem() / 1024 / 1024),
    memoryTotalMB: Math.round(os.totalmem() / 1024 / 1024)
  });
});

// CPU stress route for testing auto scaling
app.get("/stress", (req, res) => {
  console.log(`Running stress URL`);
  const duration = parseInt(req.query.duration) || 10000;
  const end = Date.now() + duration;

  while (Date.now() < end) {
    Math.sqrt(Math.random() * 1000000);
  }

  res.json({
    message: `CPU stress completed for ${duration} ms`,
    hostname: os.hostname()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
