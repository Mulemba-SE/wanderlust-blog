import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import authorRoutes from "./routes/authors";
export function createApp({ allowedOrigins }) {
    const app = express();
    app.use(cors({
        origin(requestOrigin, callback) {
            if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
                callback(null, true);
            }
            else {
                callback(new Error(`CORS: origin '${requestOrigin}' is not allowed`));
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }));
    app.use(express.json());
    app.use("/api", authRoutes);
    app.use("/api", postRoutes);
    app.use("/api", authorRoutes);
    if (process.env.NODE_ENV === "production") {
        const staticDir = path.resolve(process.cwd(), "dist");
        app.use(express.static(staticDir));
        app.get("*", (_req, res) => {
            res.sendFile(path.join(staticDir, "index.html"));
        });
    }
    else {
        app.use((req, res) => {
            res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
        });
    }
    app.use((err, _req, res, _next) => {
        console.error("[Unhandled error]", err.stack);
        res.status(500).json({ message: "Internal server error" });
    });
    return app;
}
