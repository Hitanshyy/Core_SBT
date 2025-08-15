// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // Compile contracts if not already compiled
  await hre.run("compile");

  console.log("Deploying SoulboundToken...");

  // Get the contract factory
  const SBT = await hre.ethers.getContractFactory("SoulboundToken");

  // Deploy the contract
  // Pass msg.sender as constructor arg for Ownable
  const [deployer] = await hre.ethers.getSigners();
  const sbt = await SBT.deploy();

  await sbt.deployed();

  console.log("SoulboundToken deployed to:", sbt.address);
  console.log("Deployer address:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
