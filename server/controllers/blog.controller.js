import fs from "fs";
import imagekit from "../config/imageKit.js";
import Blog from "../models/Blog.model.js";
import Comment from "../models/Comment.model.js";
import main from "../config/groq.js";

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
    const imageFileId = response.fileId;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      imageFileId,
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

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog || blog.isPublished !== true) {
      return res
        .status(401)
        .json({ success: false, message: "Blog not found!" });
    }

    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await imagekit.files.delete(blog.imageFileId);
    await Blog.findByIdAndDelete(id);

    // Delete all blogs associated with the blog
    await Comment.deleteMany({ blog: id });

    return res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    return res.status(200).json({
      success: true,
      message: "Blog status updated!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    if (!blog || !name || !content) {
      return res.status(401).json({
        success: false,
        message: "Missing required fields",
      });
    }
    await Comment.create({ blog, name, content });
    return res.status(201).json({
      success: true,
      message: "Comment added for review!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(401).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No approved comments found",
      });
    }

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const topic = req.body.prompt?.trim();
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "A blog topic is required",
      });
    }

    const content = await main(
      `Topic: ${JSON.stringify(topic)}

Write a high-quality, professional blog post about the topic above.

Structure:
- Start with one specific, compelling title using "#".
- Open with a concise hook that explains why the topic matters.
- Use 4 to 6 descriptive "##" section headings in a logical progression.
- Explain each idea with well-developed paragraphs and concrete examples.
- Include practical takeaways or actionable advice where appropriate.
- Use bullet or numbered lists only when they improve readability.
- End with a memorable conclusion that reinforces the main insight.

Formatting rules:
- Return only the blog content, with no preface or closing note.
- Use Markdown that can be converted to a Quill editor.
- Never use tables, pipe characters for columns, HTML, code blocks, or JSON.
- Do not use headings such as "Introduction" or "Conclusion" unless they genuinely suit the topic.
- Aim for approximately 700 to 1,000 words without padding.
- Do not ask for another topic.`,
    );

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Groq content generation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate blog content",
    });
  }
};
