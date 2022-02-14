import Asset from "./Asset";

export const MyAssets = ({ assets, selectedAssetTypeCallBack }) => {
  if (!assets) return null;
  return (
    <div className="text-white mt-5 text-md text-left">
      <div className="mb-4">ERC20</div>
      {assets.map(({ symbol, balance, icon, address, decimals }) => (
        <Asset
          coin={symbol}
          balance={balance}
          icon={icon}
          address={address}
          decimals={decimals}
          selectedAssetTypeCallBack={selectedAssetTypeCallBack}
        />
      ))}
    </div>
  );
};

export default MyAssets;
