import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { style } from "./style";
import { mint, mintMany, stateUpdate, withdrawMintSale } from "../module";
import AppContext from "../Context";

import ethmint from "../assets/eth-mint.png";

function Mint() {
  const { addCollectionAmount, addItemData } = useContext(AppContext);
  const [mintAmount, setMintAmount] = useState("");
  const handleMintSingle = () => {
    mint().then((id) => {
      stateUpdate(addCollectionAmount, addItemData);
      toast.success(`Succesfully Minted #${id}`);
    });
  };
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
    mintMany(mintAmount).then((ids) => {
      stateUpdate(addCollectionAmount, addItemData);
      setMintAmount("");
      toast.success(`Succesfully Minted #${ids}`);
    });
  };
  const handleWithdraw = () => {
    withdrawMintSale();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center text-white">
      <div className="w-full max-1200">
        <div className="flex items-center justify-center">
          <div className="w-1/3">
            <img className="" src={ethmint} alt="" />
            <p className="text-sm mb-2">
              Mint Price:{" "}
              <span className="font-bold text-pink-400 text-base">0.02</span>{" "}
              ETH
            </p>
            <p className="text-sm mb-5">
              Keep in mind, for multiple minting, the more amount you mint the
              more gas you'll pay.
            </p>
            <button onClick={handleWithdraw} className={style.btnUniversal}>
              Withdraw Mint Sale (testonly)
            </button>
          </div>

          <div>
            <button className={style.btnPink} onClick={handleMintSingle}>
              Mint Single ErcOrdinal
            </button>
            <input
              type="number"
              placeholder="Amount"
              className="block mt-10 px-5 py-2 mb-3 w-1/2 rounded-xl text-xs text-black"
              onChange={(e) => setMintAmount(e.target.value)}
              value={mintAmount}
            />
            <button className={style.btnUniversal} onClick={handleMintMany}>
              Mint Multiple ErcOrdinals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mint;
