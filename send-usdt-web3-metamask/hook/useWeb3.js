import Web3 from "web3";
import { useState, useEffect } from "react";
import { getERC20Contract, convertToDecimalPlace } from "../utils";
import { toast } from "react-toastify";

const toastProperties = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const useWeb3 = () => {
  let web3 = new Web3(Web3.givenProvider);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");

  useEffect(async () => {
    if (!!web3.givenProvider) {
      setHasMetamask(true);
      if (web3.currentProvider.selectedAddress) {
        setHasAccount(true);
        const account = web3.currentProvider.selectedAddress;
        const balance = await web3.eth.getBalance(account).then((wei) => wei);
        setAccount(account);
        setBalance(web3.utils.fromWei(balance, "ether"));
      } else {
        setHasAccount(false);
      }
    } else {
      setHasMetamask(false);
    }
  }, [web3]);

  const getBalance = (address, account) => {
    const contract = getERC20Contract(address, web3);
    return contract?.methods
      .balanceOf(account)
      .call()
      .then((balance) => balance);
  };

  const sendToken = (account, targetAccount, amount, tokenAddress, decimal) => {
    const parsedAmount = convertToDecimalPlace(amount, decimal);
    const contract = getERC20Contract(tokenAddress, web3);
    contract.methods
      .transfer(targetAccount, parsedAmount)
      .send({ from: account, gas: 100000 }, (error, result) => {
        if (!error) {
          toast(`Processing Transaction ${result}`, toastProperties);
        } else {
          toast("Transaction was rejected", toastProperties);
        }
      })
      .catch((err) => {
        toast("Transaction didn't go through", toastProperties);
      });
  };

  const connect = () =>
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((res) => setHasAccount(true));

  const sendEth = (val, to) => {
    console.log(typeof web3.utils.toWei(val, "ether"));
    web3.eth
      .sendTransaction({
        from: account,
        to,
        value: web3.utils.toWei(val, "ether"),
      })
      .then(console.log);
  };

  return {
    web3,
    hasMetamask,
    hasAccount,
    account,
    balance,
    sendToken,
    getBalance,
    connect,
    sendEth,
  };
};
