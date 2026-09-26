import fs from "fs";
import imagekit from "../config/imageKit.js";
import Blog from "../models/Blog.model.js";

export const addBlog = async (req, res) => {
  try {
    // `upload.single()` parses multipart/form-data into req.body. Accept regular
    // form fields, while keeping compatibility with the previous `blog` JSON field.
    let blog = req.body;

    if (req.body.blog) {
      try {
        blog = JSON.parse(req.body.blog);
      } catch {
        return res.status(400).json({
          success: false,
          message: "The blog field must contain valid JSON",
        });
      }
    }

    const { title, subTitle, description, category } = blog;
    const isPublished =
      blog.isPublished === true || blog.isPublished === "true";
    const imageFile = req.file;

    // Check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.status(401).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Upload Image to ImageKit
    const response = await imagekit.files.upload({
      // A read stream is the recommended input type for @imagekit/nodejs v7.
      file: fs.createReadStream(imageFile.path),
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    // Optimization through imagkit URL transformation
    const optimizedImageUrl = imagekit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [
        {
          quality: "auto", // Auto compression
          format: "webp", // Convert to modern format
          width: "1280", // Width resizing
        },
      ],
    });

    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    return res.status(201).json({
      success: true,
      message: "Blog added successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
