import React, { useState } from "react";

import { switchToErc721 } from "../module";
import { style } from "./style";

function Erc721Switch() {
  const [id, setId] = useState(null);

  const handleSwitch = () => {
    switchToErc721(id);
  };
  return (
    <div className="min-h-screen w-full text-white pt-16 pb-16">
      <input
        className="block mb-3 px-5 py-2 text-black"
        type="number"
        placeholder="token id"
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleSwitch} className={style.btnUniversal}>
        Switch
      </button>
    </div>
  );
}

export default Erc721Switch;
