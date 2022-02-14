import { useWeb3 } from "../hook/useWeb3";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ERC20ABI from "../abi/ERC20.json";
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

const USDT = {
  name: "YEENUS",
  address: "0xc6fDe3FD2Cc2b173aEC24cc3f267cb3Cd78a26B7",
  symbol: "YEENUS",
  decimals: 8,
  icon: "/generic.png",
};

const recipient = "0x65994f151F8A5A1C330CB860f37298E1559A5E5a";
const amount = "70";

const getHiddenVersion = (acc) =>
  `${acc.slice(0, 8)}....${acc.slice(acc.length - 8, acc.length)}`;

export const SendUSDT = () => {
  const [transactions, setTransactions] = useState([]);
  const { hasMetamask, hasAccount, account, sendToken, connect } = useWeb3();

  const SendUSDT = () => {
    sendToken(account, recipient, amount, USDT.address, USDT.decimals);
  };

  const init = async (provider, signer, myAddress, daiContract) => {
    getTransactions(daiContract, myAddress);
    listen(daiContract);
  };

  const listen = (daiContract) => {
    daiContract.once("Transfer", (from, to, amount, event) => {
      const convertedAmount = ethers.BigNumber.from(amount)
        .toString()
        .slice(0, -8);
      toast(
        `Successfully sent ${convertedAmount} ${USDT.name}`,
        toastProperties
      );
    });
  };

  const getTransactions = async (daiContract, myAddress) => {
    const filterFrom = daiContract.filters.Transfer(myAddress, null);
    const allFromMe = await daiContract.queryFilter(filterFrom);
    setTransactions(allFromMe);
  };

  useEffect(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const myAddress = await signer.getAddress();
    const daiContract = new ethers.Contract(USDT.address, ERC20ABI, provider);
    init(provider, signer, myAddress, daiContract);
  }, []);

  return (
    <div className="h-screen w-full bg-blue-50 flex flex-col justify-center items-center">
      <div className="p-4 w-[400px] place-self-center flex flex-col justify-center items-center shadow-sm hover:shadow-md rounded-md bg-white font-medium gap-5 text-gray-600 border-b-2 border-b-blue-400">
        {Boolean(!hasMetamask) && (
          <div className="w-full flex flex-col justify-center items-center gap-3">
            <img
              className="w-10 h-10 filter grayscale-0"
              src="/metamask-fox.svg"
            />
            <div>You need to install Metamask to proceed.</div>
          </div>
        )}

        {Boolean(!hasAccount && hasMetamask) && (
          <div className="w-full flex flex-col justify-center items-center gap-3">
            <img className="w-10 h-10" src="/metamask-fox.svg" />
            <div>Connect to Metamask</div>
            <button
              className="bg-blue-100 text-blue-500 text-xs font-semibold  p-2 rounded-md"
              onClick={connect}
            >
              Connect
            </button>
          </div>
        )}

        {Boolean(hasAccount && hasMetamask) && (
          <div className="w-full flex flex-col gap-4 relative">
            <div className="flex justify-end w-full gap-2 absolute">
              <img className="w-5 h-5" src="/metamask-fox.svg" />
              <img className="w-4 h-4 bg-black" src="/logo-HoV.svg" />
            </div>
            <div className="text-left w-full flex flex-col gap-2">
              <div className="text-xs transform translate-y-2 text-gray-400">
                AMOUNT
              </div>
              <div className="flex justify-start items-center gap-2">
                <div className="text-sm">
                  {" "}
                  {amount} {USDT.name}
                </div>
                <img className=" w-4 h-4" src={USDT.icon} />
              </div>
              <div className="text-xs translate-y-2 text-gray-400">
                RECEIVER
              </div>
              <div className="text-sm uppercase  text-[12px]">{recipient}</div>
            </div>
            <button
              className="bg-blue-100 text-blue-500 text-xs font-semibold  p-1 rounded-md w-full"
              onClick={SendUSDT}
            >
              Send
            </button>
          </div>
        )}
      </div>

      <div className="p-4 w-[400px] place-self-center flex flex-col justify-center items-center shadow-sm hover:shadow-md rounded-md bg-white font-medium gap-5 text-gray-600 border-b-2 border-b-blue-400 mt-4">
        <div className="text-xs">
          Recent Successful Transactions ({transactions.length})
        </div>
        <div className="w-full flex flex-col gap-1 overflow-auto h-[300px]">
          {transactions
            .map((transaction) => (
              <div className="text-xs w-full bg-gray-50 hover:bg-gray-100 hover:cursor-pointer p-2 rounded-md flex justify-between">
                <div className="flex gap-1">
                  <img className="h-4 w-4" src={USDT.icon} />
                  <div>
                    {ethers.BigNumber.from(transaction.args.value._hex)
                      .toString()
                      .slice(0, -8)}
                  </div>
                </div>
                <div>
                  <a
                    className="text-[11px]"
                    href={`https://goerli.etherscan.io/tx/${transaction.transactionHash}`}
                  >
                    {getHiddenVersion(transaction.transactionHash)}
                  </a>
                </div>
                <div className="text-green-400 text-[9px]">Successful</div>
              </div>
            ))
            .reverse()}
        </div>
      </div>
    </div>
  );
};

export default SendUSDT;
