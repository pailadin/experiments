import { useState, useEffect } from "react";
import { useWeb3 } from "../hook/useWeb3";
import Tokens from "../tokens/mainnet.json";
import MyAssets from "../components/myAssets";
import Asset from "../components/Asset";
import SendModal from "../components/SendModal";

export default function Home() {
  const assets = Tokens;
  const {
    hasMetamask,
    hasAccount,
    account,
    balance,
    getBalance,
    sendEth,
    connect,
    sendToken,
  } = useWeb3();

  const [to, setTo] = useState("");
  const [val, setVal] = useState("");
  const [myAssets, setMyAssets] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState(null);

  const onSendEth = () => {
    if (selectedAssetType.coin === "ETH") {
      sendEth(val, to);
      return;
    }
    sendToken(
      account,
      to,
      val,
      selectedAssetType.address,
      selectedAssetType.decimals
    );
  };

  const selectedAssetTypeCallBack = (coin) => {
    setSelectedAssetType(coin);
    setShowModal(true);
  };

  const getHiddenVersion = (acc) =>
    `${acc.slice(0, 5)}....${acc.slice(acc.length - 5, acc.length)}`;

  useEffect(async () => {
    if (hasAccount && account) {
      const getAll = assets.map(async (token) => {
        const balance = await getBalance(token.address, account);
        return {
          ...token,
          balance: balance.slice(0, -token.decimals),
        };
      });
      const assetsWithBalance = await Promise.all(getAll).then(
        (assets) => assets
      );
      setMyAssets(assetsWithBalance);
    }
  }, [hasAccount, account]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black shadow-md font-medium leading-none text-gray-100">
      {Boolean(hasMetamask && hasAccount) && (
        <div className=" flex flex-col items-center justify-center h-auto w-[400px]  p-4 bg-[#121212] rounded-md gap-3 border-b-4 border-green-700">
          <div className="flex justify-between content-center gap-3 w-[350px] mb-5">
            <img src="/logo-HoV.svg" />
            <div className="text-xs text-white font-semibold underline text-left">
              {getHiddenVersion(account)}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-white mt-5 text-md text-left">Assets</div>
            <Asset
              coin="ETH"
              balance={parseFloat(balance).toFixed(5)}
              icon="/eth.png"
              selectedAssetTypeCallBack={selectedAssetTypeCallBack}
            />
          </div>
          <MyAssets
            assets={myAssets}
            type="ERC-20"
            selectedAssetTypeCallBack={selectedAssetTypeCallBack}
          />
          {Boolean(showModal) && (
            <SendModal
              selectedAsset={selectedAssetType}
              setTo={setTo}
              setVal={setVal}
              onSendEth={onSendEth}
              onCancel={setShowModal}
            />
          )}
        </div>
      )}

      {!Boolean(hasMetamask) && (
        <div className="text-white text-2xl">Please Install Metamask</div>
      )}

      {!Boolean(hasAccount) && hasMetamask ? (
        <div className="flex flex-col justify-items-center gap-4 font-medium">
          <img className="w-20 place-self-center" src="/metamask-fox.svg" />
          <div className="text-white text-2xl">Login to Metamask</div>
          <button
            onClick={connect}
            className="text-white bg-green-700 rounded-md p-2 place-self-center w-20 text-md font-semibold hover:scale-105"
          >
            Connect
          </button>
        </div>
      ) : null}
    </div>
  );
}
