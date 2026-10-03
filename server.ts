import path from "path";
import express from "express";
import { expressApp } from "./server/expressApp.ts";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

// In production, serve the built Vite static files from dist/
const distPath = path.resolve(process.cwd(), "dist");
expressApp.use(express.static(distPath));

// For SPA routing, redirect all non-API requests to index.html
expressApp.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"));
});

expressApp.listen(port, () => {
  console.log(`[PM-AJAY Server] Running on http://localhost:${port}`);
  console.log(`[PM-AJAY Server] Gemini AI Engine: ${process.env.GEMINI_API_KEY ? "CONNECTED" : "FALLBACK MODE"}`);
});
