import React, { useContext, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { initialStateUpdate } from "../module";
import { trimString } from "./helper";
import AppContext from "../Context";
import { style } from "./style";
import ercordinal from "../assets/ercordinal.png";

import bag from "../assets/bag.png";
import mint from "../assets/mint.png";
import box from "../assets/box.png";
import bounty from "../assets/bounty.png";

function Dapp() {
  const {
    isConnected,
    addConnection,
    address,
    addAddress,
    addCollectionAmount,
    addItemData,
    addMintPrice,
    addLastMintedId,
  } = useContext(AppContext);
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
          addItemData,
          addMintPrice,
          addLastMintedId
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
        addItemData,
        addMintPrice
      );
    } else {
      console.log("no ethereum provider detected");
      return;
    }
  };
  return (
    <div>
      {/* w-72 h-4/5 top-1/2 -translate-y-1/2  left-10 */}
      {/* w-80 h-screen top-0 left-0 */}
      {/* Navigation ======================================================= */}
      <div className="w-60 2xl:h-4/5 h-full top-1/2 -translate-y-1/2 2xl:left-10 left-0  bg-[#202542] py-7 px-2 text-center fixed rounded-3xl">
        <img className="w-1/3 mx-auto my-0 mb-7" src={ercordinal} alt="" />
        {/* <p className="text-[#e3e1f8] text-sm mb-7">ErcOrdinal</p> */}
        <button onClick={connect} className={style.btnUniversal}>
          {isConnected ? "Account connected" : "Connect"}
        </button>
        {address && (
          <p className="text-white text-xs italic mt-3">
            {trimString(address)}
          </p>
        )}
        <div className="mt-10 px-5">
          <NavLink to="/dapp/collections" className={style.link}>
            <div className="flex items-center">
              {/* <img src={bag} className="mr-3" /> */}
              <p> Collections</p>
            </div>
          </NavLink>
          <NavLink to="/dapp/mint" className={style.link}>
            <div className="flex items-center">
              {/* <img src={mint} className="mr-3" /> */}
              <p>Mint</p>
            </div>
          </NavLink>
          <NavLink to="/dapp/ordinal" className={style.link}>
            <div className="flex items-center">
              {/* <img src={box} className="mr-3" /> */}
              <p>View an Ordinal</p>
            </div>
          </NavLink>
          <NavLink to="/dapp/bounties" className={style.link}>
            <div className="flex items-center">
              {/* <img src={bounty} className="mr-3" /> */}
              <p>Bounties</p>
            </div>
          </NavLink>
          <NavLink to="/dapp/switch" className={style.link}>
            ERC721 switch <span className="italic text-indigo-400">soon</span>
          </NavLink>
          <NavLink to="/dapp/marketplace" className={style.link}>
            Marketplace <span className="italic text-indigo-400">soon</span>
          </NavLink>
          <NavLink to="/dapp/learning" className={style.link}>
            FAQ
          </NavLink>
          <NavLink to="/dapp/learning" className={style.link}>
            Learning Material
          </NavLink>
        </div>
      </div>
      <div className="pl-60 2xl:pl-80 bg-[#252849]">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Outlet />
      </div>
      {/* Navigation========================================================== */}
    </div>
  );
}

export default Dapp;
