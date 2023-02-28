import React, { useContext, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { initialStateUpdate } from "../module";
import { trimString } from "./helper";
import AppContext from "../Context";
import ethImage from "../assets/eth.png";
import { style } from "./style";

function Dapp() {
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
          addDataImg,
          addItemData
        );
      }
    };
    checkAccount();
  }, []);
  const {
    isConnected,
    addConnection,
    address,
    addAddress,
    addCollectionAmount,
    addTokenIds,
    addDataImg,
    addItemData,
  } = useContext(AppContext);
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
        addDataImg,
        addItemData
      );
    } else {
      console.log("no ethereum provider detected");
      return;
    }
  };
  return (
    <div>
      {/* Navigation ======================================================= */}
      <div className="w-80 h-screen bg-custom-black py-10 px-5 text-center fixed top-0 left-0">
        <img className="w-3/5 mx-auto my-0" src={ethImage} alt="" />
        <button onClick={connect} className={style.btnUniversal}>
          {isConnected ? "Account connected" : "Connect"}
        </button>
        {address && (
          <p className="text-white text-xs italic">{trimString(address)}</p>
        )}
        <div className="mt-10 px-5">
          <NavLink to="/dapp/collections" className={style.link}>
            Collections
          </NavLink>
          <NavLink to="/dapp/mint" className={style.link}>
            Mint
          </NavLink>
          <NavLink to="/dapp/bounties" className={style.link}>
            Bounties
          </NavLink>
          <NavLink to="/dapp/switch" className={style.link}>
            ERC721 switch <span className="italic text-indigo-400">soon</span>
          </NavLink>
          <NavLink to="/dapp/marketplace" className={style.link}>
            Marketplace <span className="italic text-indigo-400">soon</span>
          </NavLink>
          <NavLink to="/dapp/learning" className={style.link}>
            Learning Material
          </NavLink>
        </div>
      </div>
      <div className="pl-80 bg-custom-blacker">
        <Outlet />
      </div>
      {/* Navigation========================================================== */}
    </div>
  );
}

export default Dapp;
