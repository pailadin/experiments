//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.6;
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
contract SimpleUniswapV3 {
    using LowGasSafeMath for uint256;

    address internal constant SWAP_ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    IUniswapRouter private constant UNISWAP_ROUTER = IUniswapRouter(SWAP_ROUTER);

    address private constant UNISWAP_FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    
    IQuoter private constant QUOTER = IQuoter(0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6);

    /// @dev Rinkeby ERC20 Token Addresses
    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address public constant USDC = 0xeb8f08a975Ab53E34D8a0330E0D34de942C95926;

    address payable private immutable _owner;

    event Quote(string message, uint256 amountIn, uint256 quote);

    event SendUsdt(uint256 amountIn, uint256 amountOut, uint24 poolFee, uint256 estimatedExchangeRate);

    constructor() {
        _owner = payable(msg.sender);
    }

    /// @notice Get the address of this contract and address of the owner
    function contractInfo() public view returns(address, address) {
        return (address(this), address(_owner));
    }

    /// @notice Get the balance given the address of token and the address of the account
    /// @param token address of the token [WETH, USDC, USDT]
    /// @param account address of the account that you want to know the balance of
    function balanceOf(address token, address account) public view returns(uint256) {
        return IERC20(token).balanceOf(account);
    }

    /// @dev The `poolFee` is static it is 3000.
    /// and the input is static to 1 ether to determine the exchange of 1 ether to USDT
    /// @param recipient address of the recipient
    function sendUsdt(address recipient) external payable returns(
        uint256 amountOut, 
        uint256 estimatedExchangeRate, 
        uint24 poolFee
    ) {
        require(msg.value > 0, "Must pass non 0 ETH amount");

        TransferHelper.safeTransferFrom(WETH, _owner, address(this), msg.value);
        
        TransferHelper.safeApprove(WETH, address(UNISWAP_ROUTER), msg.value);
  
        poolFee = 3000;

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: WETH,
            tokenOut: USDC,
            fee: poolFee,
            recipient: recipient,
            deadline: block.timestamp + 15,
            amountIn: msg.value,
            amountOutMinimum: 1,
            sqrtPriceLimitX96: 0
        });

        estimatedExchangeRate = QUOTER.quoteExactInputSingle(
            WETH,
            USDC,
            poolFee,
            1 ether,
            0
        );

        amountOut = UNISWAP_ROUTER.exactInputSingle(params);
        
        emit SendUsdt(msg.value, amountOut, poolFee, estimatedExchangeRate);

        UNISWAP_ROUTER.refundETH();
        
        (bool success,) = msg.sender.call{ value: address(this).balance }("");

        require(success, "refund failed");
    }

    /// @notice Quote the amount out of USDT given the WETH amount in
    /// @param wethAmount The WETH amount in
    /// @param poolFee The possible fee can be: 500, 3000, 5000
    function quoteUsdtFromEth(uint256 wethAmount, uint24 poolFee) external payable returns (uint256 quote) {
        address tokenIn = WETH;
        address tokenOut = USDC;
        uint24 fee = poolFee;
        uint160 sqrtPriceLimitX96 = 0;

        quote = QUOTER.quoteExactInputSingle(
            tokenIn,
            tokenOut,
            fee,
            wethAmount,
            sqrtPriceLimitX96
        );

        emit Quote("ETH -> USDT", wethAmount, quote);
    }

    /// @notice Allow this contract to receive ETH
    receive() external payable {}

    /// @notice Get the current balance of the owner
    function getBalance() public view returns (uint) {
        console.log("Address: ", address(this), "Owner: ", address(_owner));

        return address(_owner).balance;
    }

    /// @dev Testing Purposes
    function safeApproveWeth() external payable {
        // Transfer WETH to this contract
        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), msg.value);
        
        // Approve WETH to this contract for transfer
        TransferHelper.safeApprove(WETH, address(UNISWAP_ROUTER), msg.value);
    }
}
