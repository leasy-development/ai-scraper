import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleVerify, handleProfile } from "./routes/auth";
import { getCrawlers, getCrawler, createCrawler, updateCrawler, deleteCrawler, getCrawlerStats } from "./routes/crawlers";

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

  // Catch-all for undefined API routes - return JSON error instead of HTML
  app.use("/api/*", (_req, res) => {
    res.status(404).json({
      error: "API endpoint not found",
      message: "The requested API endpoint does not exist"
    });
  });

  return app;
}
