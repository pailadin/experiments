import ERC20ABI from "./abi/ERC20.json";

export function getERC20Contract(tokenAddress, web3) {
  return web3
    ? new web3.eth.Contract(ERC20ABI, tokenAddress, {
        from: web3.eth.defaultAccount,
      })
    : null;
}

export const convertToDecimalPlace = (amount, decimal) =>
  amount * parseInt([1, ...new Array(decimal).fill(0)].join(""));
