const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SwapExampleV3", function () {
    let swapExample, swapRouterMock, wethMock, usdcMock, owner, user;
    const feeTier = 3000;

    before(async function () {
        [owner, user] = await ethers.getSigners();

        // Deploy mocks for WETH and USDC tokens
        const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
        wethMock = await ERC20Mock.deploy("Wrapped Ether", "WETH", owner.address, ethers.utils.parseUnits("1000", 18));
        usdcMock = await ERC20Mock.deploy("USD Coin", "USDC", owner.address, ethers.utils.parseUnits("1000", 6));

        // show the amount of WETH and USDC in the owner's account
        console.log("Owner WETH Balance:", ethers.utils.formatUnits(await wethMock.balanceOf(owner.address), 18));
        console.log("Owner USDC Balance:", ethers.utils.formatUnits(await usdcMock.balanceOf(owner.address), 6));

        // Deploy a mock Uniswap router
        const SwapRouterMock = await ethers.getContractFactory("SwapRouterMock");
        swapRouterMock = await SwapRouterMock.deploy();

        // Deploy the SwapExampleV3 contract, passing in the mock swap router
        const SwapExampleV3 = await ethers.getContractFactory("SwapExampleV3");
        swapExample = await SwapExampleV3.deploy(swapRouterMock.address, wethMock.address, usdcMock.address,);

        // Transfer some WETH to the user to use in the swap
        await wethMock.transfer(user.address, ethers.utils.parseUnits("100", 18));
    });

    it("Should execute a WETH to USDC swap on Uniswap V3", async function () {
        const amountIn = ethers.utils.parseUnits("0.05", 18); // 0.05 WETH
        const initialUSDCBalance = ethers.utils.formatUnits(await usdcMock.balanceOf(owner.address), 6);
        console.log("Initial USDC Balance:", initialUSDCBalance);

        // Approve SwapExampleV3 contract to spend WETH on behalf of the user
        await wethMock.connect(user).approve(swapExample.address, amountIn);
    });
});
