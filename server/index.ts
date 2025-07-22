import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleVerify, handleProfile } from "./routes/auth";
import { getCrawlers, getCrawler, createCrawler, updateCrawler, deleteCrawler, getCrawlerStats } from "./routes/crawlers";
import { updateProfile, changePassword, deleteAccount, getAccountStats } from "./routes/account";
import { getProperties, getProperty, createProperty, updateProperty, deleteProperty, getPropertyStats } from "./routes/properties";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
