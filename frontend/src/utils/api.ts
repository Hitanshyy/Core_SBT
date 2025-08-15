import { Contract } from "ethers";
import { ethers } from "ethers";
import SoulboundTokenAbi from "./abis/SoulboundToken.json";
import { connectWallet } from "./wallet";

// ------------------------ Interfaces ------------------------
export interface SBTMetadata {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  owner: string;
  tokenId: string;
  mintedAt: string;
}

export interface MintSBTRequest {
  file: File;
  name: string;
  description: string;
  ownerAddress: string;
}

// ------------------------ Contract Config ------------------------
export const CONTRACT_ADDRESS = "0x99240713216bfe9cD226fD23C4dFB8a7D80b4712";
export const CONTRACT_ABI = SoulboundTokenAbi;

// ------------------------ Helper Function ------------------------
const getSBTContract = async (): Promise<Contract> => {
  await connectWallet();
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// ------------------------ Backend Video Upload Helper ------------------------
const uploadVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("video", file); // MUST match backend multer field

  const res = await fetch("http://localhost:4000/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Video upload failed");
  const data = await res.json();
  return data.fileUrl; // backend returns { fileUrl: "/uploads/..." }
};

// ------------------------ Backend Metadata Upload ------------------------
const uploadMetadata = async (
  name: string,
  description: string,
  videoUrl: string
): Promise<string> => {
  const metadata = { name, description, videoUrl, mintedAt: new Date().toISOString() };

  const res = await fetch("http://localhost:4000/upload-metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) throw new Error("Metadata upload failed");
  const data = await res.json();
  return data.metadataUrl;
};

// ------------------------ Blockchain Functions ------------------------
export const mintSBT = async (
  request: MintSBTRequest
): Promise<{ tokenId: string; transactionHash: string; videoUrl: string }> => {
  // Validate file
  if (request.file.size > 20 * 1024 * 1024) throw new Error("File size exceeds 20MB limit");
  if (!request.file.type.startsWith("video/")) throw new Error("Only video files are allowed");

  const contract = await getSBTContract();

  // Upload video to backend
  const videoUrl = await uploadVideo(request.file);

  // Upload metadata JSON and get tokenURI
  const tokenURI = await uploadMetadata(request.name, request.description, videoUrl);

  // Mint SBT on-chain
  const tx = await contract.mint(request.ownerAddress, tokenURI);
  await tx.wait();

  // Get the latest tokenId directly from the contract
  const tokenId = await contract.currentTokenId();

  return {
    tokenId: tokenId.toString(),
    transactionHash: tx.hash,
    videoUrl,
  };
};





// ------------------------ Other Helpers ------------------------
export const getSBTsByOwner = async (
  ownerAddress: string
): Promise<SBTMetadata[]> => {
  throw new Error("getSBTsByOwner not implemented yet");
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const validateVideoFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith("video/")) {
    return { isValid: false, error: "Please select a video file" };
  }

  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 20MB" };
  }

  const allowedExtensions = [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"];
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error:
        "Please select a valid video file (.mp4, .avi, .mov, .wmv, .flv, .webm)",
    };
  }

  return { isValid: true };
};
