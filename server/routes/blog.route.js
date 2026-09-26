import express from "express";
import { addBlog, getAllBlogs, getBlogById } from "../controllers/blog.controller.js";
import upload from "../middleware/multer.middleware.js";
import auth from "../middleware/auth.middleware.js";

const blogRouter = express.Router();

blogRouter.post("/add", auth, upload.single('image'), addBlog);
blogRouter.get("/all",getAllBlogs);
blogRouter.get("/:blogId", getBlogById)

export default blogRouter;
