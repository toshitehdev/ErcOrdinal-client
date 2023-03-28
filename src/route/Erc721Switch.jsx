import React, { useState } from "react";
import { toast } from "react-toastify";

import { switchToErc721, switchToErcord } from "../module";
import { style } from "./style";

function Erc721Switch() {
  const [id, setId] = useState(null);
  const [idBack, setIdBack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadBack, setLoadBack] = useState(false);

  const handleSwitch = () => {
    if (!id) {
      return;
    }
    setLoading(true);
    switchToErc721(id)
      .then(() => {
        setLoading(false);
        toast.success(`Successfully switched ERCORD #${id}`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Oops something went wrong");
      });
  };
  const handleSwitchBack = () => {
    if (idBack.length !== 1 || idBack.length < 1) {
      return;
    }
    setLoadBack(true);
    switchToErcord(idBack)
      .then(() => {
        setLoadBack(false);
        toast.success(`Successfully switched back #${idBack[0]}`);
      })
      .catch((err) => {
        console.log(err);
        setLoadBack(false);
        toast.error("Oops something went wrong");
      });
  };
  return (
    <div className="min-h-screen w-full text-white relative">
      <div className="bg-[#2d325b] w-full lg:w-3/5 mx-0 my-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl px-10 lg:px-16 py-16">
        <input
          className="block mb-3 px-5 py-2 text-black"
          type="number"
          placeholder="token id"
          onChange={(e) => setId(e.target.value)}
        />
        <button
          onClick={handleSwitch}
          className={`${style.btnUniversal} mb-10`}
        >
          {loading ? "Switching..." : "Switch To Erc721"}
        </button>
        <input
          className="block mb-3 px-5 py-2 text-black"
          type="number"
          placeholder="token id"
          onChange={(e) => setIdBack([e.target.value])}
        />
        <button onClick={handleSwitchBack} className={style.btnUniversal}>
          {loadBack ? "Switching..." : "SwitchBack To ERCORD"}
        </button>
      </div>
    </div>
  );
}

export default Erc721Switch;
