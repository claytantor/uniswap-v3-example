const ethers = require("ethers");
const dotenv = require("dotenv");
if (process.argv.length < 5) {
  console.error(
    "Please provide the environment file path and swap contract address as arguments."
  );
  process.exit(1);
} else {
  dotenv.config({ path: process.argv[2] });
  process.env.SWAP_CONTRACT_ADDRESS = process.argv[3];
  process.env.SWAP_AMOUNT = process.argv[4];
}
const {
  ETHERS_NETWORK,
  INFURA_PROJECT_ID,
  FROM_ADDRESS_PRIVATE_KEY,
  SWAP_CONTRACT_ADDRESS,
  USDC_CONTRACT,
  SWAP_AMOUNT
} = process.env;

async function main() {
  console.log("ethers:", ethers.version);
  console.log("ETHERS_NETWORK:", ETHERS_NETWORK);
  console.log("INFURA_PROJECT_ID:", INFURA_PROJECT_ID);

  // Set up the contract factory and provider
  const provider = new ethers.providers.InfuraProvider(
    ETHERS_NETWORK,
    INFURA_PROJECT_ID
  );
  const wallet = new ethers.Wallet(FROM_ADDRESS_PRIVATE_KEY, provider);

  const balance = await wallet.getBalance();
  console.log("Current ETH balance:", ethers.utils.formatEther(balance));
  console.log("USDC_CONTRACT:", USDC_CONTRACT);
  console.log("SWAP_CONTRACT_ADDRESS:", SWAP_CONTRACT_ADDRESS);

  if (balance.lt(ethers.utils.parseUnits("0.05", "ether"))) {
    console.error(
      "Insufficient ETH balance for gas. Please add funds to the wallet."
    );
    return;
  }

  // const WETH_ADDRESS = "0x..."; // WETH token address on Sepolia
  const ERC20_ABI = [
    "function deposit() public payable",
    "function transfer(address to, uint amount) public returns (bool)",
  ];
  const usdcContract = new ethers.Contract(USDC_CONTRACT, ERC20_ABI, wallet);
  const amount = ethers.utils.parseUnits(SWAP_AMOUNT, 6);

  // Send the transaction
  try {
    const tx = await usdcContract.transfer(SWAP_CONTRACT_ADDRESS, amount);
    console.log("Transaction sent:", tx.hash);

    // Wait for the transaction to be confirmed
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});
