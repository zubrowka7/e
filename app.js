import { serve } from "bun";
import fs from "fs";
import path from "path";

const latestData = {
  voltage: 0,
  current: 0,
  power: 0,
  energy: 0,
  frequency: 0,
  pf: 0,
};

const publicDir = path.join(import.meta.dir, "public");

const mimeType = (ext) => ({
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
}[ext] || "text/plain");

const PORT = process.env.PORT
  ? parseInt(process.env.PORT)
  : 3000;

serve({
  port: PORT,

  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/latest") {
      return new Response(
        JSON.stringify(latestData),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.pathname === "/api/data" && req.method === "POST") {
      try {
        Object.assign(latestData, await req.json());
        return new Response(
          JSON.stringify({ status: "ok" }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(
          JSON.stringify({ status: "error" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    let filePath = url.pathname === "/"
      ? "/index.html"
      : url.pathname;

    filePath = path.join(publicDir, filePath);

    try {
      const data = await fs.promises.readFile(filePath);
      return new Response(data, {
        headers: {
          "Content-Type": mimeType(path.extname(filePath)),
        },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
});