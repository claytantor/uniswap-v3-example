const hre = require("hardhat");
const dotenv = require("dotenv");

if (!process.env.CONFIG_FILE) {
  console.error(`Please provide the environment file path as env var CONFIG_FILE=`);
  process.exit(1);
} else {
  dotenv.config({ path: process.env.CONFIG_FILE });
}

const {
    UNISWAP_R2_ADDRESS,
    USDC_CONTRACT,
    WETH_CONTRACT
} = process.env;

async function main() {
  console.log("Deploying SwapExampleV3 contract...", hre.ethers.version);
  console.log("USDC_CONTRACT", USDC_CONTRACT);
  console.log("WETH_CONTRACT", WETH_CONTRACT);
  console.log("UNISWAP_R2_ADDRESS", UNISWAP_R2_ADDRESS);

  // Get the contract factory and deploy the contract with the router address as a parameter
  const SwapExampleV3 = await hre.ethers.getContractFactory("SwapExampleV3");
  const swapExample = await SwapExampleV3.deploy(UNISWAP_R2_ADDRESS, USDC_CONTRACT, WETH_CONTRACT);

  // Wait for the contract deployment to be mined
  await swapExample.deployed();

  // Display the contract address
  console.log("Contract deployed to address:", swapExample.address);
}

// Run the script and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
