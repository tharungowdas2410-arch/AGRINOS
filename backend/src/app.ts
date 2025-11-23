import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes";
import { apiLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/error.middleware";
import passport from "./config/passport";
import logger from "./utils/logger";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
const allowedOrigins = new Set<string>(["http://localhost:5173", "http://localhost:5174","https://agrinos2.vercel.app"]);
allowedOrigins.add(require("./config/env").env.FRONTEND_URL);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  try {
    const url = new URL(origin);
    if (url.hostname === "localhost") return true;
    if (url.hostname.endsWith(".vercel.app")) return true;
  } catch {}
  return false;
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(apiLimiter);

app.use(passport.initialize());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", { reason });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error });
});

export default app;

