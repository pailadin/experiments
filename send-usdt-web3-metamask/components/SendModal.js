export const SendModal = ({
  selectedAsset,
  setTo,
  setVal,
  onSendEth,
  onCancel,
}) => (
  <div className="flex flex-col space-y-4 min-w-screen h-screen animated fadeIn fast  fixed  left-0 top-0  justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-black">
    <div className="absolute flex flex-col p-8 bg-[#121212] shadow-md hover:shadow-lg rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center gap-2">
            <img src={selectedAsset.icon} />
            <div>
              {selectedAsset.balance || 0} {selectedAsset.coin}
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-10">
            <div className="text-white text-center text-xs">Address</div>
            <input
              className="rounded-md p-2 text-black"
              onChange={(e) => setTo(e.target.value)}
            ></input>
            <div className="text-white text-center text-xs">Amount</div>
            <input
              type="number"
              className="rounded-md p-2 text-black"
              onChange={(e) => setVal(e.target.value)}
            ></input>
            <button
              onClick={onSendEth}
              className="bg-[#545454] text-white p-2 rounded-md font-semibold mt-3"
            >
              Send
            </button>
            <button
              onClick={() => onCancel(false)}
              className="bg-red-500 text-white p-2 rounded-md font-semibold mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
        {/* <button className="flex-no-shrink bg-green-700 px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-700 text-white rounded-full">
        Delete
      </button> */}
      </div>
    </div>
  </div>
);

export default SendModal;
