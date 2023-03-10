import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import { setEligibleIds, idIsEligible, claimBounty } from "../module";
import { style } from "./style";
import AppContext from "../Context";

function Bounty() {
  const [selectedId, setSelectedId] = useState();
  const [amount, setAmount] = useState();
  const [claimedId, setClaimedId] = useState([]);
  const [unclaimedId, setUnclaimedId] = useState([]);
  const [expiredId, setIsExpiredId] = useState([]);
  const [idClaim, setIdClaim] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);

  const { itemData, address } = useContext(AppContext);

  useEffect(() => {
    idIsEligible(setClaimedId, setUnclaimedId, setIsExpiredId, false);
  }, []);

  const handleSelectedId = (e) => {
    setSelectedId(e.target.value);
  };
  const setBounties = () => {
    if (!selectedId) {
      return;
    }
    setEligibleIds(JSON.parse(selectedId), amount);
  };
  const handleClaimBounty = async (id) => {
    setIdClaim(id);
    setIsClaiming(true);
    try {
      await claimBounty(id);
      await idIsEligible(setClaimedId, setUnclaimedId, setIsExpiredId, true);
      toast.success("Bounty claimed sucessfully!");
      setIsClaiming(false);
    } catch (error) {
      console.log(error);
      toast.error("Oops something went wrong");
      setIsClaiming(false);
    }
  };
  const renderUnclaimed = () => {
    return unclaimedId.map((item) => {
      if (!item.from_claiming) {
        return (
          <div key={item.id} className="border border-gray-400 text-xs p-3">
            {
              <p className="text-white">
                {item.prize_amount} /
                <span className="font-semibold text-pink-400">#{item.id}</span>
              </p>
            }
          </div>
        );
      }
    });
  };
  const renderClaimed = () => {
    return claimedId.map((item) => {
      return (
        <div key={item.id} className="border border-gray-400 text-xs p-3">
          {
            <p className="text-white">
              {item.prize_amount} /
              <span className="font-semibold text-indigo-200">#{item.id}</span>
            </p>
          }
        </div>
      );
    });
  };
  const renderExpired = () => {
    return expiredId.map((item) => {
      return (
        <div key={item.id} className="border border-gray-400 text-xs p-3">
          {
            <p className="text-white">
              {item.prize_amount} /
              <span className="font-semibold text-gray-400">#{item.id}</span>
            </p>
          }
        </div>
      );
    });
  };

  const renderUserBounty = () => {
    return unclaimedId.map((item) => {
      return itemData.map((data) => {
        if (data.id == item.id && !item.from_claiming) {
          return (
            <div
              key={item.id}
              className="text-center border border-indigo-500 pt-3"
            >
              {<p className="text-white text-sm">ID: #{item.id}</p>}
              <p className="text-sm mb-3">
                Prize: {item.prize_amount} free mint
              </p>
              <button
                onClick={() => handleClaimBounty(item.id)}
                className={`${style.btnUniversal} w-full rounded-none`}
                disabled={idClaim == item.id && isClaiming ? true : false}
              >
                {idClaim == item.id && isClaiming ? "Claiming..." : "Claim"}
              </button>
            </div>
          );
        }
      });
    });
  };

  return (
    <div className="min-h-screen text-white w-full py-5">
      <div className="pt-10">
        <p>Input id for bounties, format example: [id,id,id,id] .</p>
        <p>
          This action is for testing purpose only. Mainnet just use etherscan
          UI.
        </p>
        <p>Do this operation with deployer account.</p>
        <input
          onChange={(e) => handleSelectedId(e)}
          type="text"
          placeholder="Ids"
          className="mt-7 px-5 py-2 w-96 block mb-5 text-black"
        />
        <p>Free minting amount for the above ids.</p>
        <p>Input how much free minting should the above ids get each.</p>
        <input
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
          className="px-5 py-2 block mb-5 text-black"
        />
        <button onClick={setBounties} className={style.btnUniversal}>
          Set Bounties
        </button>
      </div>
      <p className="mt-5">
        -------This section below will be shown to user (will work on styling
        later)------------
      </p>
      <div className="mt-5 w-10/12 max-w-[1300px] mx-auto my-0">
        <div className="mb-5">
          <NavLink
            to="/bounties:id"
            className="text-xs bg-[#8d409a] px-5 py-2 rounded-xl mr-4 font-semibold"
          >
            Free Mint Bounties
          </NavLink>
          <NavLink
            to="/bounties:id"
            className="text-xs border border-[#8d409a] px-5 py-2 rounded-xl font-semibold"
          >
            ETH Bounties
          </NavLink>
        </div>
        <div className="grid grid-cols-2 gap-5 mt-10 ">
          <div>
            <p className="text-sm mb-2">
              Unclaimed : [ prize amount | #claiming id ]
            </p>
            <div className="bg-[#2d325b] p-10 mb-5 rounded-3xl max-h-1/2 overflow-y-auto">
              <div className="grid grid-cols-4 gap-5 align-middle">
                {renderUnclaimed()}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm mb-2">
              Claimed : [ prize amount | #claiming id ]
            </p>
            <div className="bg-[#2d325b] p-10 mb-5 rounded-3xl max-h-1/2 overflow-y-auto">
              <div className="grid grid-cols-4 gap-5 align-middle">
                {renderClaimed()}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm mb-2">Expired:</p>
        <div className="bg-[#2d325b] p-10 mb-5 rounded-3xl max-h-1/3 overflow-y-auto">
          <div className="grid grid-cols-8 gap-5 align-middle">
            {renderExpired()}
          </div>
        </div>
        <p className="text-sm mb-2">Your Available Bounty:</p>
        <div className="bg-[#2d325b] p-10 mb-5 rounded-3xl">
          <div className="grid grid-cols-3 gap-5 align-middle">
            {renderUserBounty()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bounty;
