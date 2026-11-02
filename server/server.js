import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRouter from "./routes/admin.route.js";
import blogRouter from "./routes/blog.route.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send("api is healthy!")
})

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        res.status(503).json({
            success: false,
            message: "Database unavailable",
        });
    }
});

app.use("/api/admin", adminRouter)
app.use("/api/blog", blogRouter)

const PORT = process.env.PORT || 3000;

if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

export default app;