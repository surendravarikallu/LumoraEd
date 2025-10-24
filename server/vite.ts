import { createRequire } from "module";
import { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import { dirname } from "path";

const require = createRequire(import.meta.url);
const express = require("express");

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: process.env.NODE_ENV === 'development' ? { server } : false,
    allowedHosts: true as const,
    // Ensure Vite works in serverless environments
    base: '/',
    root: path.resolve(__dirname, '..', 'client'),
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  try {
    // In production on Vercel, serve client files directly (like development)
    const clientPath = path.resolve(__dirname, "..", "client");
    
    if (fs.existsSync(clientPath)) {
      // Serve client files directly (like npm run dev)
      app.use(express.static(clientPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
      });
    } else {
      // Fallback to dist if client doesn't exist
      const distPath = path.resolve(__dirname, "..", "dist", "public");
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
          res.sendFile(path.join(distPath, "index.html"));
        });
      } else {
        console.error(`Could not find client directory: ${clientPath} or build directory: ${distPath}`);
        // Serve a basic error page instead of throwing
        app.get("*", (req, res) => {
          res.status(404).send(`
            <html>
              <head><title>Application Error</title></head>
              <body>
                <h1>Application Error</h1>
                <p>Static files not found. Please check your deployment configuration.</p>
              </body>
            </html>
          `);
        });
      }
    }
  } catch (error) {
    console.error("Error in serveStatic:", error);
    // Fallback error handler
    app.get("*", (req, res) => {
      res.status(500).send(`
        <html>
          <head><title>Server Error</title></head>
          <body>
            <h1>Server Error</h1>
            <p>An error occurred while setting up static file serving.</p>
          </body>
        </html>
      `);
    });
  }
}
