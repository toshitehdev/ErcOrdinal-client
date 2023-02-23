import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../constant";

function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [collectionAmount, setCollectionAmount] = useState(0);
  const collectionData = [
    {
      id: 1,
      img: "https://picsum.photos/200/",
    },
    {
      id: 2,
      img: "https://picsum.photos/200",
    },
    {
      id: 34500,
      img: "https://picsum.photos/200",
    },
  ];

  const provider = new ethers.BrowserProvider(window.ethereum);
  useEffect(() => {
    const checkAccount = async () => {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      if (accounts.length > 0) {
        initialStateUpdate(account);
      }
    };
    checkAccount();
  }, []);

  const initialStateUpdate = async (account) => {
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );
    const tokenHoldings = await contract.getAddressToIds(account);
    setIsConnected(true);
    setAddress(account);
    setCollectionAmount(tokenHoldings.length);
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      initialStateUpdate(account);
    } else {
      console.log("no ethereum provider detected");
      return;
    }
  };
  const mint = async () => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const mint = await contract.mint("this one", "test uri", {
      value: ethers.parseEther("0.05"),
    });
    await mint.wait();
  };

  const collectionList = () => {
    return collectionData.map((item) => {
      return (
        <div key={item.id} className="border border-indigo-500 p-5">
          <img src={item.img} alt="" />
          <p className="font-bold">#{item.id}</p>
        </div>
      );
    });
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
            <button className="mb-5 mt-5 px-7 py-3 bg-indigo-500 text-white">
              Load More
            </button>
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
