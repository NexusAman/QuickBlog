import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send("api is healthy!")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

export default app;