//SPDX-License-Identifier: Unlicense
pragma solidity <=0.8.11;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

/// @title Simple implementation of Uniswap V3 for experiment
/// @dev The test network is Rinkeby. The SWAPS happen only in WETH to USDC.
contract SimpleSwap {
    using LowGasSafeMath for uint256;

    address internal constant SWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

    IUniswapRouter private constant _UNISWAP_ROUTER = IUniswapRouter(SWAP_ROUTER);

    address private constant _UNISWAP_FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    
    IQuoter private constant _QUOTER = IQuoter(0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6);

    /// @dev Rinkeby ERC20 Token Addresses
    address private constant _WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    address private constant _USDC = 0xeb8f08a975Ab53E34D8a0330E0D34de942C95926;
    address private constant _USDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address private constant _DAI = 0x8ad3aA5d5ff084307d28C8f514D7a193B2Bfe725;
    
    address payable public immutable owner;

    event Quote(string message, uint256 amountIn, uint256 quote);

    event SendUsdt(uint256 amountIn, uint256 amountOut, uint24 poolFee);

    constructor() {
        owner = payable(msg.sender);
    }

    /// @dev The `poolFee` is static it is 3000.
    /// and the input is static to 1 ether to determine the exchange of 1 ether to USDT
    /// @param _recipient address of the recipient
    function sendUsdt(address _recipient) external payable returns(
        uint256 amountOut, 
        uint24 poolFee
    ) {
        require(msg.value > 0, "Must pass non 0 ETH amount");

        TransferHelper.safeTransferFrom(_WETH, msg.sender, address(this), msg.value);
        
        TransferHelper.safeApprove(_WETH, address(_UNISWAP_ROUTER), msg.value);
  
        poolFee = 3000;

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: _WETH,
            tokenOut: _DAI,
            fee: poolFee,
            recipient: _recipient,
            deadline: block.timestamp + 15,
            amountIn: msg.value,
            amountOutMinimum: 1,
            sqrtPriceLimitX96: 0
        });

        amountOut = _UNISWAP_ROUTER.exactInputSingle(params);
        
        emit SendUsdt(msg.value, amountOut, poolFee);

        // UNISWAP_ROUTER.refundETH();
        
        // (bool success,) = msg.sender.call{ value: address(this).balance }("");

        // require(success, "refund failed");
    }

    /// @notice Quote the amount out of USDT given the WETH amount in
    /// @param wethAmount The WETH amount in
    /// @param poolFee The possible fee can be: 500, 3000, 5000
    function quoteUsdtFromEth(uint256 wethAmount, uint24 poolFee) external payable returns (uint256 quote) {
        address tokenIn = _WETH;
        address tokenOut = _USDC;
        uint24 fee = poolFee;
        uint160 sqrtPriceLimitX96 = 0;

        quote = _QUOTER.quoteExactInputSingle(
            tokenIn,
            tokenOut,
            fee,
            wethAmount,
            sqrtPriceLimitX96
        );

        emit Quote("ETH -> USDT", wethAmount, quote);
    }

    /// @notice Get the current balance of the owner
    function getBalance() public view returns (uint) {
        console.log("Address: ", address(this), "Owner: ", address(owner));

        return address(owner).balance;
    }

    /// @dev Testing Purposes
    function safeApproveWeth() external payable {
        // Transfer WETH to this contract
        TransferHelper.safeTransferFrom(_WETH, msg.sender, address(this), msg.value);
        
        // Approve WETH to this contract for transfer
        TransferHelper.safeApprove(_WETH, address(_UNISWAP_ROUTER), msg.value);
    }

    /// @notice Allow this contract to receive ETH
    // receive() external payable {}
}
