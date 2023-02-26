import React, { useState, useEffect, useContext } from "react";
import { ethers, isAddress } from "ethers";
import { contractAddress, contractABI } from "../constant";
import { initialStateUpdate, stateUpdate, transferSingle } from "../module";
import AppContext from "../Context";

function Home() {
  const [dataImg, setDataImg] = useState({});
  const [activeButton, setActiveButton] = useState(1);
  const [renderFrom, setRenderFrom] = useState(0);
  const {
    isConnected,
    addConnection,
    address,
    addAddress,
    collectionAmount,
    addCollectionAmount,
    tokenIds,
    addTokenIds,
    addressTransferSingle,
    addAddressToTransfer,
  } = useContext(AppContext);

  const step = 6;

  const provider = new ethers.BrowserProvider(window.ethereum);
  useEffect(() => {
    const checkAccount = async () => {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      if (accounts.length > 0) {
        initialStateUpdate(
          account,
          addConnection,
          addAddress,
          addCollectionAmount,
          addTokenIds,
          setDataImg
        );
      }
    };
    checkAccount();
  }, []);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      initialStateUpdate(
        account,
        addConnection,
        addAddress,
        addCollectionAmount,
        addTokenIds,
        setDataImg
      );
    } else {
      console.log("no ethereum provider detected");
      return;
    }
  };
  const mint = async () => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const tx = await contract.mint({
        value: ethers.parseEther("0.05"),
      });
      const response = await provider.getTransactionReceipt(tx.hash);
      const uu = contract.interface.parseLog(response.logs[0]);
      const mintedId = ethers.toNumber(uu.args["1"]) - 1;
      await response.confirmations();
      const fetchNew = await fetch(
        `https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${mintedId}`
      );
      const json = await fetchNew.json();
      const str = json.image.slice(7);
      const img = `https://ipfs.io/ipfs/${str}`;

      stateUpdate(signer)
        .then((data) => {
          addCollectionAmount(data.tokenIds.length);
          addTokenIds(data.tokenIds);
          setDataImg((prev) => [...prev, img]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const collectionList = () => {
    let arr = [];
    for (let i = renderFrom; i < renderFrom + step; i++) {
      if (i < tokenIds.length) {
        arr.push(
          <div key={tokenIds[i]} className="border border-indigo-500 p-5 h-96">
            <img src={dataImg[tokenIds[i]]} alt="" />
            <p className="font-bold mb-3">#{tokenIds[i]}</p>
            <input
              className="border border-gray-500 px-3 py-2"
              type="text"
              placeholder="Address to transfer"
              onChange={(e) => addAddressToTransfer(e.target.value)}
            />
            <button
              onClick={() => transferSingle(addressTransferSingle, tokenIds[i])}
              className="mb-5 mt-2 px-5 py-2 bg-pink-500 text-white"
            >
              Transfer
            </button>
          </div>
        );
      }
    }
    return arr;
  };

  const loadMore = (start) => {
    setRenderFrom(start * step - step);
  };

  const paginationButton = () => {
    const buttonCount = Math.ceil(tokenIds.length / step);

    let arr = [];
    for (let i = 0; i < buttonCount; i++) {
      arr.push(
        <button
          key={tokenIds[i]}
          onClick={() => {
            loadMore(i + 1);
            setActiveButton(i + 1);
          }}
          className={`border hover:bg-indigo-200 border-indigo-500 py-2 px-5 ml-3 ${
            activeButton == i + 1 && "bg-indigo-500 text-white"
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return arr;
  };

  return (
    <div className="mt-24 ml-24">
      <button
        onClick={connect}
        className="mb-5 px-7 py-3 bg-indigo-500 text-white"
      >
        {isConnected ? "Account connected" : "Connect"}
      </button>
      {address && <p>{address}</p>}
      <div className="border-4 border-indigo-500/100 w-3/5 p-10 mt-5">
        {isConnected && (
          <>
            <p className="mb-10">My collections: {collectionAmount}</p>
            <div className="grid grid-cols-3 gap-4">{collectionList()}</div>
            <div className="mt-7 flex justify-end">{paginationButton()}</div>
          </>
        )}
      </div>
      <button
        onClick={mint}
        className="mb-5 mt-10 px-7 py-3 bg-pink-500 text-white"
      >
        Mint new ErcOrdinal
      </button>
    </div>
  );
}

export default Home;
