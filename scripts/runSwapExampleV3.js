const ethers = require("ethers");
const dotenv = require("dotenv");
const hre = require("hardhat");
if (process.argv.length < 4) {
  console.error("Please provide the environment file path and swap contract address as arguments.");
  process.exit(1);
} else {
  dotenv.config({ path: process.argv[2] });
  process.env.SWAP_CONTRACT_ADDRESS = process.argv[3];
}

const {
    ETHERS_NETWORK,
    INFURA_PROJECT_ID,
    FROM_ADDRESS_PRIVATE_KEY,
    SWAP_CONTRACT_ADDRESS
} = process.env;



async function main() {
  
    console.log("ethers:", ethers.version);
    console.log("ETHERS_NETWORK:", ETHERS_NETWORK);
    console.log("INFURA_PROJECT_ID:", INFURA_PROJECT_ID);
    
    // Set up the contract factory and provider
    const provider = new ethers.providers.InfuraProvider(ETHERS_NETWORK, INFURA_PROJECT_ID);
    const wallet = new ethers.Wallet(FROM_ADDRESS_PRIVATE_KEY, provider);
    console.log("Wallet address:", wallet.address);
    const balance = await wallet.getBalance();
    console.log("Current ETH balance:", ethers.utils.formatEther(balance));
 
    // Load the contract
    const SwapExampleV3 = await hre.ethers.getContractFactory("SwapExampleV3", wallet);
    const swapExampleV3 = await SwapExampleV3.attach(SWAP_CONTRACT_ADDRESS);
    console.log("SwapExampleV3 contract address:", swapExampleV3.address);

    if (balance.lt(ethers.utils.parseUnits("0.05", "ether"))) {
        console.error("Insufficient ETH balance for gas. Please add funds to the wallet.");
        return;
    }

    // Call the swap function
    const amountIn = ethers.utils.parseUnits("3.0", 6); // Adjust based on the token's decimals
    console.log("amountIn:", amountIn);
    try {

        //const gasLimitMax = ethers.utils.parseUnits("10", "gwei");
        const gasLimitMax = 500000;

        const tx = await swapExampleV3.swapExactInputSingle(amountIn, {
          gasLimit: gasLimitMax // Adjust the value as needed
        });

        console.log("Transaction hash:", tx.hash);

        // Wait for the transaction to be confirmed
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);

        // Log the amountOut from the event or receipt
        console.log("Transaction completed. Output received:", receipt);
    } catch (error) {
        console.error("Error during swap:", error);
    }
}

main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});
