// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity = 0.7.6;
pragma abicoder v2;

// https://github.com/Uniswap/swap-router-contracts
import '@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol';

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}

contract SwapExampleV3 {
    // For the scope of these swap examples,
    // we will detail the design considerations when using
    // `exactInput`, `exactInputSingle`, `exactOutput`, and  `exactOutputSingle`.

    // It should be noted that for the sake of these examples, we purposefully pass in the swap router instead of inherit the swap router for simplicity.
    // More advanced example contracts will detail how to inherit the swap router safely.
    // https://docs.uniswap.org/contracts/v3/reference/deployments/ethereum-deployments

    // address public constant routerAddressMainnet =
    //     0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45;

    // address public constant routerAddressSepolia =    
    //     0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E;

    // IV3SwapRouter public immutable swapRouter = IV3SwapRouter(routerAddressSepolia);
    IV3SwapRouter public immutable swapRouter;

    // on Sepolia testnet
    // address public constant USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    address public immutable USDC;
    // address public constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;
    address public immutable WETH;

    IERC20 public immutable usdcToken;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor(IV3SwapRouter _swapRouter, address _USDC, address _WETH) {
        swapRouter = _swapRouter;
        USDC = _USDC;
        WETH = _WETH;
        usdcToken = IERC20(_USDC);
    }

    /// @notice swapExactInputSingle swaps a fixed amount of USDC for a maximum possible amount of WETH
    /// using the USDC/WETH 0.3% pool by calling `exactInputSingle` in the swap router.
    /// @dev The calling address must approve this contract to spend at least `amountIn` worth of its USDC for this function to succeed.
    /// @param amountIn The exact amount of USDC that will be swapped for WETH.
    /// @return amountOut The amount of WETH received.
    function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut) {
        
        usdcToken.approve(address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount
        IV3SwapRouter.ExactInputSingleParams memory params =
                IV3SwapRouter.ExactInputSingleParams({
                    tokenIn: USDC,
                    tokenOut: WETH,
                    fee: poolFee,
                    recipient: address(this),
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    /// @notice swapExactOutputSingle swaps a minimum possible amount of USDC for a fixed amount of WETH.
    /// @dev The calling address must approve this contract to spend its USDC for this function to succeed. As the amount of input USDC is variable,
    /// the calling address will need to approve for a slightly higher amount, anticipating some variance.
    /// @param amountOut The exact amount of WETH to receive from the swap.
    /// @param amountInMaximum The amount of USDC we are willing to spend to receive the specified amount of WETH.
    /// @return amountIn The amount of USDC actually spent in the swap.
    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {

        // Approve the router to spend the specifed `amountInMaximum` of USDC.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
        usdcToken.approve(address(swapRouter), amountInMaximum);

        IV3SwapRouter.ExactOutputSingleParams memory params =
            IV3SwapRouter.ExactOutputSingleParams({
                tokenIn: USDC,
                tokenOut: WETH,
                fee: poolFee,
                recipient: address(this),
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = swapRouter.exactOutputSingle(params);

        // // For exact output swaps, the amountInMaximum may not have all been spent.
        // // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            usdcToken.approve(address(swapRouter), 0);
            usdcToken.transfer(address(this), amountInMaximum - amountIn);
        }
    }
}