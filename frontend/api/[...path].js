import http from "http";
import https from "https";
import { URL } from "url";

export default function handler(req, res) {
  const base = process.env.BACKEND_URL;
  if (!base) {
    res.status(500).json({ message: "BACKEND_URL missing" });
    return;
  }
  const forwardPath = (req.url || "").replace(/^\/api/, "");
  const targetUrl = new URL(`${base}/api${forwardPath}`);
  const isHttps = targetUrl.protocol === "https:";
  const client = isHttps ? https : http;
  const headers = { ...req.headers };
  headers.host = targetUrl.host;
  const options = {
    method: req.method || "GET",
    headers
  };
  const proxyReq = client.request(targetUrl, options, (proxyRes) => {
    res.status(proxyRes.statusCode || 502);
    Object.entries(proxyRes.headers).forEach(([key, value]) => {
      if (typeof value !== "undefined") {
        res.setHeader(key, value);
      }
    });
    proxyRes.pipe(res);
  });
  proxyReq.on("error", () => {
    res.status(502).json({ message: "Bad gateway" });
  });
  if ((req.method || "GET") === "GET" || (req.method || "GET") === "HEAD") {
    proxyReq.end();
  } else {
    req.pipe(proxyReq);
  }
}

