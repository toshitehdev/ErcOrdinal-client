import React, { useState, useEffect, useContext } from "react";
import {
  setEligibleIds,
  idIsEligible,
  subscribeBountyAdded,
  claimBounty,
} from "../module";
import { style } from "./style";
import AppContext from "../Context";

function Bounty() {
  const [selectedId, setSelectedId] = useState();
  const [amount, setAmount] = useState();
  const [claimedId, setClaimedId] = useState([]);
  const [unclaimedId, setUnclaimedId] = useState([]);
  const { itemData } = useContext(AppContext);

  useEffect(() => {
    async function getEligibility() {
      const nn = await idIsEligible();
      const unclaimed = nn.filter((item) => item.is_claimed == false);
      const claimed = nn.filter((item) => item.is_claimed == true);
      setClaimedId(claimed);
      setUnclaimedId(unclaimed);
      subscribeBountyAdded();
    }
    getEligibility();
  }, []);

  const handleSelectedId = (e) => {
    setSelectedId(e.target.value);
  };
  const setBounties = () => {
    if (!selectedId) {
      return;
    }
    //160.170.180
    // console.log(JSON.parse(selectedId));
    setEligibleIds(JSON.parse(selectedId), amount);
  };
  const renderUnclaimed = () => {
    return unclaimedId.map((item) => {
      return (
        <div key={item.id}>
          {
            <p className="text-white">
              id: {item.id}, prize: {item.prize_amount} free mint
            </p>
          }
        </div>
      );
    });
  };
  const renderClaimed = () => {
    return claimedId.map((item) => {
      return (
        <div>
          {
            <p className="text-white">
              {" "}
              id: {item.id}, claimed prize: {item.prize_amount} free mint
            </p>
          }
        </div>
      );
    });
  };

  const handleClaimBounty = async (id) => {
    await claimBounty(id);
    const nn = await idIsEligible();
    const unclaimed = nn.filter((item) => item.is_claimed == false);
    const claimed = nn.filter((item) => item.is_claimed == true);
    //update state here
    setClaimedId(claimed);
    setUnclaimedId(unclaimed);
    subscribeBountyAdded();
  };

  const renderUserBounty = () => {
    return unclaimedId.map((item) => {
      return itemData.map((data) => {
        if (data.id == item.id) {
          return (
            <div key={item.id}>
              {
                <p className="text-white">
                  you own id: {item.id}, available prize: {item.prize_amount}{" "}
                  free mint
                </p>
              }
              <button
                onClick={() => handleClaimBounty(item.id)}
                className={style.btnUniversal}
              >
                Claim
              </button>
            </div>
          );
        }
      });
    });
  };

  return (
    <div className="min-h-screen w-full text-white">
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
      <div className="w-4/5 border border-gray-500 p-10 mb-5 mt-5">
        <p>Unclaimed Bounties</p>
        {renderUnclaimed()}
      </div>
      <div className="w-4/5 border border-gray-500 p-10 mb-5">
        <p>Claimed Bounties</p>
        {renderClaimed()}
      </div>
      <div className="w-4/5 border border-gray-500 p-10 mb-5">
        <p>Your Available Bounty to Claim:</p>
        <div className="border border-purple-400 p-5">{renderUserBounty()}</div>
      </div>
    </div>
  );
}

export default Bounty;
