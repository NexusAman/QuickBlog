import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  const [scheme, token] = header?.trim().split(/\s+/) ?? [];

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is missing or malformed",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default auth;
