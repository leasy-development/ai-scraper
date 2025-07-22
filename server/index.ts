import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleVerify, handleProfile } from "./routes/auth";
import { getCrawlers, getCrawler, createCrawler, updateCrawler, deleteCrawler, getCrawlerStats } from "./routes/crawlers";
import { updateProfile, changePassword, deleteAccount, getAccountStats } from "./routes/account";
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty, getPropertyStats } from "./routes/properties";

export function createServer() {
  const app = express();

  // Security middleware
  app.use(cors());

  // Request logging in development
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      });
      next();
    });
  }

  // Body parsing middleware with size limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/verify", handleVerify);
  app.get("/api/auth/profile", handleProfile);
  app.put("/api/auth/profile", updateProfile);
  app.put("/api/auth/change-password", changePassword);
  app.delete("/api/auth/delete-account", deleteAccount);
  app.get("/api/auth/stats", getAccountStats);

  // Crawler routes
  app.get("/api/crawlers", getCrawlers);
  app.get("/api/crawlers/stats", getCrawlerStats);
  app.get("/api/crawlers/:id", getCrawler);
  app.post("/api/crawlers", createCrawler);
  app.put("/api/crawlers/:id", updateCrawler);
  app.delete("/api/crawlers/:id", deleteCrawler);

  // Property routes
  app.get("/api/properties", getProperties);
  app.get("/api/properties/stats", getPropertyStats);
  app.get("/api/properties/:id", getProperty);
  app.post("/api/properties", createProperty);
  app.put("/api/properties/:id", updateProperty);
  app.delete("/api/properties/:id", deleteProperty);

  // Catch-all for undefined API routes - return JSON error instead of HTML
  app.use("/api/*", (_req, res) => {
    res.status(404).json({
      error: "API endpoint not found",
      message: "The requested API endpoint does not exist"
    });
  });

  return app;
}
