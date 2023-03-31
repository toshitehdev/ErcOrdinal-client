import React from "react";
import { NavLink } from "react-router-dom";
import { style } from "./style";
import ercordinal from "../assets/ercordinal.png";
import bghero from "../assets/bghero.png";
import uni from "../assets/uni.png";
import etherscan from "../assets/etherscan.png";
import dextools from "../assets/dextools.png";
import telegram from "../assets/telegram.png";
import twitter from "../assets/twitter.png";
import discord from "../assets/discord.png";
import github from "../assets/github.jpeg";

function Home() {
  return (
    <div className="">
      <div className="bg-[#252849] min-h-screen p-5 relative">
        <div className="flex items-center">
          <img className="w-8" src={ercordinal} alt="" />
          <h1 className="text-[#feffff] text-xs font-semibold ml-2">
            ErcOrdinal
          </h1>
        </div>
        <div className="md:flex items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5  max-w-[1200px]">
          <div className="text-[#feffff]">
            <h2 className="font-bold text=[##93a2c7]">
              NFT that you can trade on DEX!
            </h2>
            <h2 className="text-lg font-bold text-[#527bdc]">
              NFT that will never goes to 0 in value!
            </h2>
            <p className="text-white text-sm mt-2 mb-5">
              ErcOrdinal is token with both ERC20 interface and ERC721
              attributes.
            </p>
            <NavLink
              to="/dapp"
              target="_blank"
              className={`${style.btnUniversal} mr-5`}
            >
              Enter Dapp
            </NavLink>
            <NavLink
              to="/dapp/mint"
              target="_blank"
              className={`${style.btnUniversal}`}
            >
              Mint Now
            </NavLink>
          </div>
          <div className="mt-10 w-11/12 md:w-3/5 mx-auto my-0">
            <img src={bghero} alt="" />
          </div>
        </div>
      </div>
      <div className="bg-[#2e325c] p-10 md:py-36">
        <div className="max-w-[800px] mx-auto my-0">
          <h1 className="text-[#9f7fed] font-bold mb-5">ErcOrdinal?</h1>
          <div className="text-sm text-white">
            <p className="leading-6">
              ErcOrdinal has both ERC20 interface and ERC721 attributes, that
              means ErcOrdinal is a full ERC20 compliant token, you can trade it
              on DEX just like any ERC20 tokens.
            </p>
            <p className="mt-3 leading-6">
              But at the same time, ErcOrdinal has the unique attributes just
              like ERC721 has. It means every single ErcOrdinal has its own
              unique #ID and metadata, just like any ERC721 tokens.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#202543] p-10 text-white md:py-36">
        <div className="max-w-[800px] mx-auto my-0">
          <h1 className="font-bold mb-5">ROADMAP</h1>
          <p className="leading-6 text-sm">
            Currently, ErcOrdinal is not tradeable on regular NFT marketplace
            like opensea or x2y2. That because even though every ErcOrdinal has
            uniqe #ID, the marketplace will need to adopt the ErcOrdinal
            standard if they want to be able to list ErcOrdinal.
          </p>
          <p className="mt-3 leading-6 text-sm">
            We are planning to add compatibility so you can switch ErcOrdinal to
            fully compliant ERC721. And in the future, we will also build our
            own marketplace that implement ErcOrdinal interface.
          </p>
          <div className="bg-[#7855d8] p-10 rounded-3xl mt-5">
            <h2 className="text-sm font-semibold">Phase 0: Dapp Launch</h2>
          </div>
          <div className="bg-[#7855d8] p-10 rounded-3xl mt-5">
            <h2 className="text-sm font-semibold">Phase 1: Erc721 Switch</h2>
          </div>
          <div className="bg-[#7855d8] p-10 rounded-3xl mt-5">
            <h2 className="text-sm font-semibold">Phase 2: Marketplace</h2>
          </div>
        </div>
      </div>
      <div className="bg-[#2e325c] p-10 md:py-36">
        <div className="max-w-[800px] mx-auto my-0">
          <h1 className="text-[#9f7fed] font-bold mb-5">Tokenomic</h1>
          <div className="text-sm text-white">
            <p className="leading-6">
              ErcOrdinal is ERC20 token, but at the same time have unique
              attributes like ERC721. This makes Ercordinal can be traded on
              dex, and can be minted like regular NFTs. Acquiring ErcOrdinal can
              be done either via buying from Uniswap or directly mint it in the
              DAPP.
            </p>
            <p className="mt-3 leading-6">
              With such a unique utility, ErcOrdinal comes with unique tokenomic
              as well. 100 ERCORD provided as liquidity on Uniswap pool, and the
              rest of it is available for minting. When price on Uniswap is
              higher than minting price, this can be an opportunity to mint
              ERCORD and sell for profit on Uniswap.
            </p>
            <p className="mt-3 leading-6">
              What if Uniswap price is way lower than minting price? in that
              case, we have allocated some of ETH from minting sale for buyback.
              Where will the token from buyback go? We won't burn it, we have
              better plan, which is to list the token on NFT marketplace like
              opensea. Sale from opensea will directly be used for more buyback
              and bounties for community.
            </p>
            <p className="mt-3 leading-6">Breakdown of the tokenomic:</p>
            <ul className="list-disc">
              <li>Max Supply: 100,000</li>
              <li>Dev Token: 11</li>
              <li>Uniswap Initial Liquidity: 100</li>
              <li>Minting: 99,889</li>
              <span className="mt-3 block">Minting Sale Allocation:</span>
              <ul className="list-disc">
                <li>Dev: 40%</li>
                <li>Buyback: 30%</li>
                <li>Marketing: 15%</li>
                <li>Bounty: 10%</li>
                <li>Further Development: 5%</li>
              </ul>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#202543] p-10 text-white">
        <h2 className="text-center font-bold mb-5">Contract</h2>
        <div className="flex items-center justify-center">
          <a
            className="mr-5"
            href="https://app.uniswap.org/#/swap?outputCurrency=0xc85f1a1baaee1e4e892edf78e4c0a7a376459bdc"
            target="_blank"
          >
            <img className="w-9" src={uni} alt="" />
          </a>
          <a
            className=""
            href="https://etherscan.io/address/0xC85f1A1BAaEe1E4E892EdF78e4c0A7a376459bDC"
            target="_blank"
          >
            <img className="w-9" src={etherscan} alt="" />
          </a>
          <a
            className="ml-5"
            href="https://www.dextools.io/app/en/ether/pair-explorer/0x4a2fcfa13f15acff07d0236d0b5b201724e105a4"
          >
            <img className="w-8" src={dextools} alt="" />
          </a>
        </div>
        <h2 className="text-center font-bold mb-5 mt-10">Socials</h2>
        <div className="flex items-center justify-center">
          <a
            className="mr-5"
            href="https://t.me/+NQvN3JU7WnBmNmM1"
            target="_blank"
          >
            <img className="w-9" src={telegram} alt="" />
          </a>
          <a className="" href="https://twitter.com/ErcOrdinal" target="_blank">
            <img className="w-9" src={twitter} alt="" />
          </a>
          <a className="ml-5" href="https://discord.gg/gkcxuKtU5j">
            <img className="w-8" src={discord} alt="" />
          </a>
          <a className="ml-5" href="https://github.com/toshitehdev/ErcOrdinal">
            <img className="w-9" src={github} alt="" />
          </a>
        </div>
      </div>

      <div className="p-5 bg-[#5046e5]">
        <p className="text-white text-center">ercordinal&copy;2023</p>
      </div>
    </div>
  );
}

export default Home;
