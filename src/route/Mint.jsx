import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { style } from "./style";
import { mint, mintMany, stateUpdate, withdrawMintSale } from "../module";
import AppContext from "../Context";

import ethmint from "../assets/eth-mint.png";

function Mint() {
  const {
    addCollectionAmount,
    addItemData,
    mintPrice,
    addMintPrice,
    lastMintedId,
  } = useContext(AppContext);
  const [mintAmount, setMintAmount] = useState("");
  const handleMintSingle = async () => {
    // try {
    //   const _id = await mint(addMintPrice);
    //   await stateUpdate(addCollectionAmount, addItemData, addMintPrice);
    //   toast.success(`Succesfully Minted #${_id}`);
    // } catch (error) {
    //   toast.error(error.Error);
    // }

    mint(addMintPrice)
      .then((id) => {
        stateUpdate(addCollectionAmount, addItemData, addMintPrice);
        toast.success(`Succesfully Minted #${id}`);
      })
      .catch((error) => {
        toast.error(error.Error);
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
    mintMany(mintAmount, addMintPrice)
      .then((ids) => {
        stateUpdate(addCollectionAmount, addItemData, addMintPrice);
        setMintAmount("");
        toast.success(`Succesfully Minted #${ids}`);
      })
      .catch((error) => {
        if (error.code == "ACTION_REJECTED") {
          toast.warning("You rejected the action");
        } else {
          const paramIndexString = error.message.indexOf("(") - 1;
          const errorMessage = error.message.slice(0, paramIndexString);
          toast.error(errorMessage);
        }
      });
  };
  // const handleWithdraw = () => {
  //   withdrawMintSale();
  // };

  return (
    <div className="min-h-screen w-full text-white relative text-center">
      <div className="bg-[#2d325b] w-3/5 mx-0 my-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl px-16 py-16">
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

          {/* <button onClick={handleWithdraw} className={style.btnUniversal}>
              Withdraw Mint Sale (testonly)
            </button> */}
        </div>

        <div className="text-center">
          {/* <button className={style.btnPink} onClick={handleMintSingle}>
              Mint Single ErcOrdinal
            </button> */}
          <input
            type="number"
            placeholder="Amount"
            className="block px-5 py-2 mb-3 rounded-full text-xs text-black w-32  mx-auto my-0"
            onChange={(e) => setMintAmount(e.target.value)}
            value={mintAmount}
          />
          <button className={style.btnUniversal} onClick={handleMintMany}>
            Mint ErcOrdinals
          </button>

          <p className="text-sm mt-7">
            Keep in mind, the more amount you mint the more gas you'll pay.
          </p>
          <p className="text-xs text-[#a3a0c2]">
            Price will be up at every 100 #id.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mint;
