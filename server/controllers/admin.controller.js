import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    return res.json({ success: true, token: token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
