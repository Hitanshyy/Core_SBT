// backend/routes/get-sbts.js
import express from "express";
import { sbts } from "./sbts.js"; // Import the SBT array

const router = express.Router();

// GET all minted SBTs
router.get("/", (req, res) => {
  res.json(sbts);
});

export default router;
