import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRouter from "./routes/admin.route.js";

const app = express();

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRouter)

app.get('/health', (req, res) => {
    res.send("api is healthy!")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

export default app;