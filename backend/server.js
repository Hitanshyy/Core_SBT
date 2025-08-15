// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import { ethers } from "ethers";

import uploadRoutes from "./routes/upload.js";
import getSBTsRouter from "./routes/get-sbts.js";
import uploadMetadataRoutes from "./routes/upload-metadata.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" })); // important for JSON body
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Root route for testing
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// Serve uploaded files locally
app.use("/uploads", express.static("uploads"));
app.use("/metadata", express.static("metadata"));
// Mount routes
app.use("/", uploadRoutes); // POST /upload
app.use("/sbts", getSBTsRouter); // extra SBT-specific routes
app.use("/upload-metadata", uploadMetadataRoutes);


// Load ABI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SoulboundTokenAbi = JSON.parse(
  readFileSync(path.join(__dirname, "abis", "SoulboundToken.json"), "utf-8")
);

// Setup provider & contract (Ethers v5 syntax)
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  SoulboundTokenAbi,
  provider
);

// Optional: API to fetch all minted SBTs directly
app.get("/api/sbts", async (req, res) => {
  try {
    const totalSupply = await contract.totalSupply();
    const sbts = [];

    for (let i = 0; i < totalSupply; i++) {
      const tokenId = await contract.tokenByIndex(i);
      const tokenURI = await contract.tokenURI(tokenId);

      const response = await fetch(tokenURI);
      const metadata = await response.json();

      sbts.push({
        tokenId: tokenId.toString(),
        name: metadata.name,
        description: metadata.description,
        videoHash: metadata.videoUrl.replace(
          "https://gateway.pinata.cloud/ipfs/",
          ""
        ),
        videoUrl: metadata.videoUrl,
        owner: await contract.ownerOf(tokenId),
        mintedAt: metadata.mintedAt || new Date().toISOString(),
      });
    }

    res.json(sbts);
  } catch (err) {
    console.error("Error fetching SBTs:", err);
    res.status(500).json({ error: "Failed to fetch SBTs from blockchain" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
