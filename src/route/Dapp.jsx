import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { initialStateUpdate } from "../module";
import { trimString } from "./helper";
import AppContext from "../Context";
import { style } from "./style";
import ercordinal from "../assets/ercordinal.png";
import menu from "../assets/menu.png";

function Dapp() {
  const [menuShown, setMenuShown] = useState(false);
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
      <img
        src={menu}
        onClick={() => setMenuShown(!menuShown)}
        className="lg:hidden fixed text-white top-3 right-3 z-50"
      />
      <div
        className={`w-60 2xl:h-4/5 h-full top-1/2 -translate-y-1/2 2xl:left-10 ${
          menuShown ? "left-0" : "-left-64"
        } lg:left-0 bg-[#202542] py-7 px-2 text-center fixed rounded-3xl ease-in-out duration-300 z-50 shadow-2xl shadow-stone-900 lg:shadow-none`}
      >
        <img
          className="w-1/5 lg:w-1/3 mx-auto my-0 mb-4 lg:mb-7"
          src={ercordinal}
          alt=""
        />
        {/* <p className="text-[#e3e1f8] text-sm mb-7">ErcOrdinal</p> */}
        <button onClick={connect} className={style.btnUniversal}>
          {isConnected ? "Account connected" : "Connect"}
        </button>
        {address && (
          <p className="text-white text-xs italic mt-3">
            {trimString(address)}
          </p>
        )}
        <div className="mt-5 lg:mt-10 px-5">
          <NavLink
            onClick={() => setMenuShown(!menuShown)}
            to="/dapp/collections"
            className={style.link}
          >
            <div className="flex items-center">
              {/* <img src={bag} className="mr-3" /> */}
              <p> Collections</p>
            </div>
          </NavLink>
          <NavLink
            onClick={() => setMenuShown(!menuShown)}
            to="/dapp/mint"
            className={style.link}
          >
            <div className="flex items-center">
              {/* <img src={mint} className="mr-3" /> */}
              <p>Mint</p>
            </div>
          </NavLink>
          <NavLink
            onClick={() => setMenuShown(!menuShown)}
            to="/dapp/ordinal"
            className={style.link}
          >
            <div className="flex items-center">
              {/* <img src={box} className="mr-3" /> */}
              <p>View an Ordinal</p>
            </div>
          </NavLink>
          <NavLink
            onClick={() => setMenuShown(!menuShown)}
            to="/dapp/bounties"
            className={style.link}
          >
            <div className="flex items-center">
              {/* <img src={bounty} className="mr-3" /> */}
              <p>Bounties</p>
            </div>
          </NavLink>
          <NavLink
            onClick={() => setMenuShown(!menuShown)}
            to="/dapp/switch"
            className={style.link}
          >
            ERC721 switch <span className="italic text-indigo-400">soon</span>
          </NavLink>
          <NavLink
            onClick={() => setMenuShown(!menuShown)}
            to="/dapp/marketplace"
            className={style.link}
          >
            Marketplace <span className="italic text-indigo-400">soon</span>
          </NavLink>
          <NavLink
            onClick={() => setMenuShown(!menuShown)}
            to="/dapp/faq"
            className={style.link}
          >
            FAQ
          </NavLink>
          <NavLink
            onClick={() => setMenuShown(!menuShown)}
            to="/dapp/learning"
            className={style.link}
          >
            Learning Material
          </NavLink>
        </div>
      </div>
      <div className="px-5 lg:pl-60 2xl:pl-80 bg-[#252849]">
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
