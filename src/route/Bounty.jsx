import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function Bounty() {
  return (
    <div className="min-h-screen text-white w-full py-5">
      <div className="mt-5 w-10/12 max-w-[1300px] mx-auto my-0">
        <div className="mb-5">
          <NavLink
            to="/dapp/bounties/freemint"
            className={({ isActive }) => {
              const cn = isActive ? "bg-[#3c3c9b]" : "";
              return (
                cn +
                ` text-xs border border-indigo-500 px-5 py-2 rounded-full mr-4 font-semibold`
              );
            }}
          >
            Free Mint Bounties
          </NavLink>
          <NavLink
            to="/dapp/bounties/ethbounty"
            className={({ isActive }) => {
              const cn = isActive ? "bg-[#3c3c9b]" : "";
              return (
                cn +
                ` text-xs border border-indigo-500 px-5 py-2 rounded-full mr-4 font-semibold`
              );
            }}
          >
            ETH Bounties
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Bounty;
