# SwapExampleV3
This is a basic example of how to swap tokens using Uniswap V3 using Hardhat and ethers.js 5.7.6.

For this example, we will use the following contracts:
https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments

Steps:

1. Compile and Deploy the SwapExampleV3 contract to sepolia
2. Send some USDC tokens to the contract
3. Execute the swap

## Installationof Hardhat
This project demonstrates a basic Hardhat use case. To install Hardhat, run the following commands:

```shell
mkdir SwapExampleV3
cd SwapExampleV3
npm init -y
npm install --save-dev hardhat
npx hardhat
```

and configure the `hardhat.config.js` file as follows:

```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.7.6",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // Uncomment and set up for deployment on Sepolia or mainnet
    sepolia: {
        url: "https://sepolia.infura.io/v3/<infura_project_id>",
        accounts: ["0x<private_key>"],
    },
  },
};
```

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
```

# setting up the environment variables
create a file named `config/.env.swap.sepolia` in the root directory of the project and add the following content:

```shell
ETHERS_NETWORK="sepolia"
INFURA_PROJECT_ID=<infura project id>

# metamask wallet
FROM_ADDRESS_PRIVATE_KEY = <private key>

# V3 needs to use SwapRouter02
# https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments
UNISWAP_R2_ADDRESS = 0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E

# ERC20 contracts
USDC_CONTRACT = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
WETH_CONTRACT = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14
```

## compiling the contracts
`npx hardhat compile`

will compile as:

```
Compiled 1 Solidity file successfully (evm target: istanbul).
```

## deploy to localhost (hardhat)
`CONFIG_FILE=config/.env.swap.local npx hardhat run scripts/deploySwapExampleV3.js --network localhost`
will deploy as:

```shell
Deploying SwapExampleV3 contract... ethers/5.7.2
USDC_CONTRACT 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
WETH_CONTRACT 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14
UNISWAP_R2_ADDRESS 0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E
Contract deployed to address: 0x0165878A594ca255338adfa4d48449f69242Eb8F
```

## deploy to sepolia
`CONFIG_FILE=config/.env.swap.sepolia npx hardhat run scripts/deploySwapExampleV3.js --network sepolia`
will deploy as:

```shell
Deploying SwapExampleV3 contract... ethers/5.7.2
USDC_CONTRACT 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
WETH_CONTRACT 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14
UNISWAP_R2_ADDRESS 0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E
Contract deployed to address: 0xBD5D2e49f2F24a0fCcDDAb2A8E024765BF19D289
```

# send 10 USDC tokens to the swap contract
`node scripts/sendContractUSDC.js config/.env.swap.sepolia 0xBD5D2e49f2F24a0fCcDDAb2A8E024765BF19D289 10`  
will send as:

```shell
ethers: ethers/5.7.2
ETHERS_NETWORK: sepolia
INFURA_PROJECT_ID: b85fa7cae94f481e86ff1151a7b6190d
Current ETH balance: 0.077962106028558963
USDC_CONTRACT: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
SWAP_CONTRACT_ADDRESS: 0xBD5D2e49f2F24a0fCcDDAb2A8E024765BF19D289
Transaction sent: 0x9227bcb2f4be4b8e0aba957e2869c65c921128926ef179f75d1458c54f14aeda
Transaction confirmed in block: 6971100
```

# execute the contract swap
`node scripts/runSwapExampleV3.js config/.env.swap.sepolia 0xBD5D2e49f2F24a0fCcDDAb2A8E024765BF19D289`

and if the swap was successful, it will show as:

```shell
ethers: ethers/5.7.2
ETHERS_NETWORK: sepolia
INFURA_PROJECT_ID: b85fa7cae94f481e86ff1151a7b6190d
Wallet address: 0x2d58EAa585D375449Dca93aAcD2e01798a97EBB5
Current ETH balance: 0.077130085741333176
SwapExampleV3 contract address: 0xBD5D2e49f2F24a0fCcDDAb2A8E024765BF19D289
amountIn: BigNumber { value: "3000000" }
Transaction hash: 0xb1626a3700c369d8d215786bbf1ffdc065f4e43972df59bd7976590ca8d1988d
Transaction confirmed in block: 6971192
```