import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Ensure metadata folder exists
const metadataDir = path.join("metadata");
if (!fs.existsSync(metadataDir)) fs.mkdirSync(metadataDir);

router.post("/", (req, res) => {
  const { name, description, videoUrl, mintedAt } = req.body;
  console.log("Received metadata:", req.body); // Debug: check if data is coming

  if (!name || !description || !videoUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const fileName = `${Date.now()}.json`;
  const filePath = path.join(metadataDir, fileName);

  // Write JSON with proper indentation
  fs.writeFileSync(filePath, JSON.stringify({ name, description, videoUrl, mintedAt }, null, 2));

  res.json({ metadataUrl: `/metadata/${fileName}` });
});

export default router;
