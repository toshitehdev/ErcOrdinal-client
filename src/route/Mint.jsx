import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { style } from "./style";
import { mintMany, stateUpdate, withdrawMintSale } from "../module";
import AppContext from "../Context";

import ethmint from "../assets/eth-mint.png";
import loading from "../assets/loading.gif";

function Mint() {
  const {
    addCollectionAmount,
    addItemData,
    mintPrice,
    addMintPrice,
    lastMintedId,
  } = useContext(AppContext);

  const [mintAmount, setMintAmount] = useState("");
  const [isMinting, setIsMinting] = useState(false);

  const handleMintMany = () => {
    if (!mintAmount) {
      return;
    }
    if (mintAmount % 1 !== 0) {
      return;
    }
    if (mintAmount < 1) {
      return;
    }
    setIsMinting(true);
    mintMany(mintAmount, addMintPrice, () => {
      toast.success("You Just Won The Bounty", {
        icon: "🚀",
      });
    })
      .then(async (ids) => {
        stateUpdate(addCollectionAmount, addItemData, addMintPrice);
        setMintAmount("");
        toast.success(`Succesfully Minted #${ids}`);
        setIsMinting(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.code == "ACTION_REJECTED") {
          toast.warning("You rejected the action");
          setIsMinting(false);
        } else {
          const paramIndexString = error.message.indexOf("(") - 1;
          const errorMessage = error.message.slice(0, paramIndexString);
          toast.error(errorMessage);
          setIsMinting(false);
        }
      });
  };

  return (
    <div className="min-h-screen w-full text-white relative text-center">
      <div className="bg-[#2d325b] w-full lg:w-3/5 mx-0 my-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl px-10 lg:px-16 py-16">
        <h1 className="text-center mb-5 text-sm font-semibold">
          Last Minted: #{lastMintedId}
        </h1>

        <div className="">
          <img className="w-1/3 mx-auto my-0 mb-5" src={ethmint} alt="" />
          <p className="text-sm mb-5">
            Mint Price:{" "}
            <span className="font-bold text-pink-400 text-base">
              {mintPrice}
            </span>{" "}
            ETH
          </p>
        </div>

        <div className="text-center">
          <input
            type="number"
            placeholder="Amount"
            className="block px-5 py-2 mb-3 rounded-full text-xs text-black w-32  mx-auto my-0"
            onChange={(e) => setMintAmount(e.target.value)}
            value={mintAmount}
          />
          <button
            disabled={isMinting ? true : false}
            className={style.btnUniversal}
            onClick={handleMintMany}
          >
            {isMinting ? "Minting..." : "Mint ErcOrdinal"}
          </button>

          <p className="text-sm mt-7">
            Keep in mind, the more amount you mint the more gas you'll pay.
          </p>
          <p className="text-xs text-[#a3a0c2]">
            Price will be up at every 500 #id.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mint;
