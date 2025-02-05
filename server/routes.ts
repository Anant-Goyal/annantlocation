import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Add any other API routes here
  app.get('/api/settings', (req, res) => {
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}