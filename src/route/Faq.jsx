import React from "react";

function Faq() {
  return (
    <div className="min-h-screen w-full text-white pt-16 pb-16">
      <p className="text-center">FAQ</p>
      <div className="max-w-[900px] mx-auto my-0 mt-10">
        <p className="text-sm font-bold bg-[#2f365c] p-5 rounded-t-xl text-[#a9a9ab]">
          Can I buy ERCORD on Uniswap?
        </p>
        <p className="p-7 text-sm bg-[#40486c] rounded-b-xl mb-5">
          Yes, You can buy ERCORD on Uniswap.
        </p>
        <p className="text-sm font-bold bg-[#2f365c] p-5 rounded-t-xl text-[#a9a9ab]">
          Can I chose which ERCORD to sell on Uniswap?
        </p>
        <p className="p-7 text-sm bg-[#40486c] rounded-b-xl mb-5">
          No, when you sell on Uniswap, the tokens that will get transferred to
          Uniswap is the tokens started from the last list of your holding.
        </p>
        <p className="text-sm font-bold bg-[#2f365c] p-5 rounded-t-xl text-[#a9a9ab]">
          How do I keep my favorite tokens so it wont get transferred when I
          want to sell some tokens?
        </p>
        <p className="p-7 text-sm bg-[#40486c] rounded-b-xl mb-5">
          You can select the token from your collection list, and send it to
          your other wallet.
        </p>

        <p className="text-sm font-bold bg-[#2f365c] p-5 rounded-t-xl text-[#a9a9ab]">
          Can I hold my eligible bounty and claim whenever I want?
        </p>
        <p className="p-7 text-sm bg-[#40486c] rounded-b-xl mb-5">
          Absolutely, you can hold your eligible bounty and claim whenever you
          want. Your claim amount will be reserved.
        </p>

        <p className="text-sm font-bold bg-[#2f365c] p-5 rounded-t-xl text-[#a9a9ab]">
          Why trade on Uniswap need much gas?
        </p>
        <p className="p-7 text-sm bg-[#40486c] rounded-b-xl mb-5">
          This is not necessarily true. The gas you paid depends on the amount
          of tokens you buy/sell. The more you buy/sell, the more gas you'll
          pay.
        </p>
        <p className="text-sm font-bold bg-[#2f365c] p-5 rounded-t-xl text-[#a9a9ab]">
          Can I list ERCORD on NFT Marketplace such as Opensea?
        </p>
        <p className="p-7 text-sm bg-[#40486c] rounded-b-xl mb-5">
          No, You can not. The marketplace will need to adopt ErcOrdinal
          standard if they want to be able to list ERCORD. However, we will have
          switch mechanism so You can switch ERCORD to a fully ERC721 compliant
          token.
        </p>
        <p className="text-sm font-bold bg-[#2f365c] p-5 rounded-t-xl text-[#a9a9ab]">
          Where can I buy/sell ERCORD without switching?
        </p>
        <p className="p-7 text-sm bg-[#40486c] rounded-b-xl mb-5">
          We are building our own marketplace, you will be able to buy/sell
          ERCORD there without switching.
        </p>
      </div>
    </div>
  );
}

export default Faq;
