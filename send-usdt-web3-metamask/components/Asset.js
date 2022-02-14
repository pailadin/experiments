import React from "react";

function Asset({
  coin,
  balance,
  icon,
  address,
  decimals,
  selectedAssetTypeCallBack,
}) {
  return (
    <div
      onClick={() =>
        selectedAssetTypeCallBack({ coin, balance, icon, address, decimals })
      }
      className="h-15 w-[350px] bg-[#1e1e1e] opacity-6 flex justify-items-center items-center p-5 mb-4 gap-4 rounded-sm text-white mt-5 text-2xl hover:bg-[#323232] hover:cursor-pointer"
    >
      <img className="w-10 h-10 rounded-full" src={icon} />
      <div>{balance || 0}</div>
      <div>{coin}</div>
    </div>
  );
}

export default Asset;
