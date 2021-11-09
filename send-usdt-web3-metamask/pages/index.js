import Web3 from "web3";
import { useState, useEffect } from "react";

export default function Home() {
  let web3 = new Web3(Web3.givenProvider);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [gas, setGas] = useState("0");
  const [to, setTo] = useState("");
  const [val, setVal] = useState("");

  const getAcc = async () => {
    const account = web3.currentProvider.selectedAddress;
    const balance = await web3.eth.getBalance(account).then((wei) => wei);
    const gas = await web3.eth.getGasPrice().then((wei) => wei);
    setAccount(account);
    setBalance(balance);
    setGas(gas);
  };

  useEffect(() => {
    getAcc();
  }, []);

  const getHiddenVersion = (acc) =>
    `${acc.slice(0, 5)}....${acc.slice(acc.length - 5, acc.length)}`;

  const sendEth = () => {
    web3.eth
      .sendTransaction({
        from: account,
        to,
        value: web3.utils.toWei(val, "ether"),
      })
      .then(console.log);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-[#121212] shadow-md">
      <div className="flex flex-col items-center justify-center h-[500px] w-[400px] bg-[#2C2C2C] rounded-md gap-3 border-b-4 border-[#545454]">
        <div className="text-4xl text-white font-semibold">
          {web3.utils.fromWei(balance, "ether")} ETH
        </div>
        <div className="text-xl text-white font-semibold underline">
          {getHiddenVersion(account)}
        </div>

        <div className="flex flex-col gap-1 mt-10">
          <div className="text-white text-center text-xs">Address</div>
          <input
            className="rounded-md p-2"
            onChange={(e) => setTo(e.target.value)}
          ></input>
          <div className="text-white text-center text-xs">Amount</div>
          <input
            className="rounded-md p-2"
            onChange={(e) => setVal(e.target.value)}
          ></input>
          <button
            onClick={sendEth}
            className="bg-[#545454] text-white p-2 rounded-md font-semibold mt-3"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
