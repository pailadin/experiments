import { useWeb3 } from "../hook/useWeb3";

const USDT = {
  name: "USDCoin",
  address: "0x509ee0d083ddf8ac028f2a56731412edd63223b9",
  symbol: "USDC",
  decimals: 6,
  icon: "/usdc.png",
};

const recipient = "0x65994f151F8A5A1C330CB860f37298E1559A5E5a";
const amount = "20";

export const SendUSDT = () => {
  const { hasMetamask, hasAccount, account, sendToken, connect } = useWeb3();

  const SendUSDT = () => {
    sendToken(account, recipient, amount, USDT.address, USDT.decimals);
  };

  return (
    <div className="h-screen w-full bg-blue-50 flex justify-center items-center">
      <div className="p-4 w-[400px] place-self-center flex flex-col justify-center items-center shadow-sm hover:shadow-md rounded-md bg-white font-medium gap-5 text-gray-600 border-b-4 border-b-blue-400">
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
          <div className="flex flex-col gap-4 relative">
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
              <div className="text-sm uppercase">{recipient}</div>
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
    </div>
  );
};

export default SendUSDT;
