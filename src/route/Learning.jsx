import React from "react";

function Learning() {
  return (
    <div className="min-h-screen w-full text-white pt-16 pb-16">
      <div className="max-w-[900px] mx-auto my-0 mt-10">
        <p className="mb-7 font-bold">Learning Materials:</p>
        <a
          className="text-sm text-blue-100 underline block mb-5 italic"
          href="https://eips.ethereum.org/EIPS/eip-20"
          target="_blank"
        >
          Download: ErcOrdinal LitePaper
        </a>
        <a
          className="text-sm text-blue-100 underline block mb-5 italic"
          href="https://eips.ethereum.org/EIPS/eip-20"
          target="_blank"
        >
          EIPS: ERC20 Standard
        </a>
        <a
          className="text-sm text-blue-100 underline block mb-5 italic"
          href="https://eips.ethereum.org/EIPS/eip-721"
          target="_blank"
        >
          EIPS: ERC721 Standard
        </a>
      </div>
    </div>
  );
}

export default Learning;
