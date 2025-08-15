// routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure upload folder exists
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) =>  {
  const fileUrl = `/uploads/${req.file.filename}`;
  // Store file URL in database here (MongoDB, MySQL, etc.)
  res.json({ success: true, fileUrl });
});

export default router;
