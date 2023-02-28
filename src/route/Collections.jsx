import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { transferSingle, transfer, transferMany } from "../module";
import AppContext from "../Context";

import ethPanda from "../assets/eth-panda.png";
import placeholder from "../assets/placeholder.png";

import { style } from "./style";

function Collections() {
  const [activeButton, setActiveButton] = useState(1);
  const [renderFrom, setRenderFrom] = useState(0);
  const [selectedItemData, setSelectedItemData] = useState([]);
  const [addressTransferMany, setAddressTransferMany] = useState(null);
  //prolly delete later
  const [addressTransfer, setAddressTransfer] = useState("");
  const [transferAmount, setTransferAmount] = useState(null);
  const {
    isConnected,
    addConnection,
    address,
    addAddress,
    collectionAmount,
    addCollectionAmount,
    tokenIds,
    addTokenIds,
    addressTransferSingle,
    addAddressToTransfer,
    dataImg,
    addDataImg,
    itemData,
    addItemData,
  } = useContext(AppContext);

  const [activeInput, setActiveInput] = useState(null);
  const step = 12;

  const handleTransferSingle = async (id, image) => {
    try {
      await transferSingle(addressTransferSingle, id);
      //filter tokenIds and dataImg
      const filteredTokenId = tokenIds.filter((item) => item != id);
      const filteredDataImg = dataImg.filter((item) => item != image);
      const filteredItemData = itemData.filter((item) => item.id !== id);
      addTokenIds(filteredTokenId);
      addDataImg(filteredDataImg);
      addItemData(filteredItemData);
      addAddressToTransfer("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelection = (e, data) => {
    if (e.target.checked) {
      setSelectedItemData([...selectedItemData, data]);
    } else {
      const filteredItemData = selectedItemData.filter(
        (item) => item.id !== data.id
      );
      setSelectedItemData(filteredItemData);
    }
  };

  const collectionList = () => {
    let arr = [];
    for (let i = renderFrom; i < renderFrom + step; i++) {
      if (!itemData[i]) {
        arr.push(
          <div
            key={`plch${i}`}
            className="invisible border border-gray-700 rounded-2xl overflow-hidden relative"
          >
            <input type="checkbox" className="absolute top-3 right-3" />
            <Link to="" className="block p-2">
              <img src={placeholder} />
              <p className="font-bold mb-3 mt-3 text-white">#000</p>
            </Link>
            <div className="bg-light-black p-5">
              <input
                className="border border-gray-500 px-3 py-1 text-sm w-full mb-3"
                type="text"
                placeholder="Transfer to"
              />
              <button className="mt-2 px-5 py-2 hover:bg-pink-500 bg-pink-600 text-white text-xs font-bold rounded-lg">
                Transfer
              </button>
            </div>
          </div>
        );
      } else {
        arr.push(
          <div
            key={itemData[i].id}
            className="border border-gray-700 rounded-2xl overflow-hidden relative"
          >
            <input
              onChange={(e) => handleSelection(e, itemData[i])}
              type="checkbox"
              className="absolute top-3 right-3"
              checked={selectedItemData.includes(itemData[i])}
            />
            <Link to="" className="block p-2">
              <img src={itemData[i].img} alt="" />
              <p className="font-bold mb-3 mt-3 text-white">
                #{itemData[i].id}
              </p>
            </Link>
            <div className="bg-light-black p-5">
              <input
                className="border border-gray-500 px-3 py-1 text-sm w-full mb-3"
                type="text"
                placeholder="Transfer to"
                onChange={(e) => {
                  setActiveInput(i);
                  addAddressToTransfer(e.target.value);
                }}
                value={activeInput === i ? addressTransferSingle : ""}
              />
              <button
                onClick={() =>
                  handleTransferSingle(itemData[i].id, itemData[i].img)
                }
                className="mt-2 px-5 py-2 hover:bg-pink-500 bg-pink-600 text-white text-xs font-bold rounded-lg"
              >
                Transfer
              </button>
            </div>
          </div>
        );
      }

      // }
    }
    return arr;
  };

  const loadMore = (start) => {
    setRenderFrom(start * step - step);
  };

  const paginationButton = () => {
    const buttonCount = Math.ceil(tokenIds.length / step);

    let arr = [];
    for (let i = 0; i < buttonCount; i++) {
      arr.push(
        <button
          key={tokenIds[i]}
          onClick={() => {
            loadMore(i + 1);
            setActiveButton(i + 1);
          }}
          className={style.btnPagination(activeButton, i)}
        >
          {i + 1}
        </button>
      );
    }
    return arr;
  };

  const selectedOrdinals = () => {
    return selectedItemData.map((item) => {
      return (
        <div className="w-16 mr-2" key={item.id}>
          <img src={item.img} alt="" />
          <p className="text-white">#{item.id}</p>
        </div>
      );
    });
  };

  const handleTransfer = () => {
    if (!addressTransfer || !transferAmount) {
      return;
    }
    transfer(addressTransfer, transferAmount);
  };
  const handleTransferMany = () => {
    if (selectedItemData.length < 1) {
      return;
    }
    if (!addressTransferMany) {
      return;
    }
    const idToSend = selectedItemData.map((item) => item.id);
    // console.log(idToSend);
    transferMany(addressTransferMany, idToSend);
  };

  return (
    <div className="min-h-screen py-5">
      <div className=" w-full mt-5 max-1200 mx-auto my-0">
        {isConnected && (
          <>
            <div className="linear p-5 mb-7 rounded-2xl flex items-center">
              <img src={ethPanda} className="h-24" alt="" />
              <div className=" w-16 h-16 pinky-linear justify-center rounded-full ml-10 flex items-center">
                <h2 className="text-white font-bold text-lg">
                  {collectionAmount}
                </h2>
              </div>

              <div className="w-1/2 ml-10 text-white">
                <p className="text-sm font-light text-center">
                  You can transfer your precious ordinals to your other wallet
                  to make them safe, to exclude them when you trade on uniswap.
                </p>
                <p className="border border-white text-xs py-2 px-5 rounded-xl mt-2">
                  Check the checkbox to transfer multiple ordinals
                </p>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-6 bg-custom-black p-10 rounded-xl">
              {collectionList()}
            </div>

            <div className="mt-7 flex justify-end">{paginationButton()}</div>
            {/* Selected item ============================== */}
            <div>
              <input
                type="number"
                placeholder="Amount"
                className="w-36 px-6 py-2 rounded-full mr-4 text-sm"
                onChange={(e) => setTransferAmount(Number(e.target.value))}
              />
              <input
                type="text"
                placeholder="Transfer to"
                className="w-96 px-6 py-2 rounded-full mr-4 text-sm"
                onChange={(e) => setAddressTransfer(e.target.value)}
              />

              <button onClick={handleTransfer} className={style.btnUniversal}>
                Transfer Without Selecting
              </button>

              <h1 className="text-indigo-300 mt-5 mb-5 text-sm font-bold">
                Selected Ordinals:
              </h1>
              <input
                type="text"
                placeholder="Transfer to"
                className="w-96 px-6 py-2 rounded-full mr-4 text-sm"
                onChange={(e) => setAddressTransferMany(e.target.value)}
              />
              <button
                onClick={handleTransferMany}
                className={style.btnUniversal}
              >
                Transfer
              </button>
              <p className="mb-5 text-sm text-gray-200">
                Keep in mind, the more you transfer the more gas you'll pay
              </p>
              <button className="text-white text-xs font-bold bg-red-500 px-5 py-2 rounded-full mb-3">
                Cancel All
              </button>
              <div className="flex border border-gray-700 p-8 rounded-3xl mb-10">
                {selectedOrdinals()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Collections;
