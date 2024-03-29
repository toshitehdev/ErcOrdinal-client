import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { transferSingle, transfer, transferMany, stateUpdate } from "../module";
import AppContext from "../Context";

import ethPanda from "../assets/eth-panda.png";
import placeholder from "../assets/placeholder.png";
import bgplc from "../assets/bgplc.png";

import { style } from "./style";

function Collections() {
  const [activeButton, setActiveButton] = useState(1);
  const [renderFrom, setRenderFrom] = useState(0);
  const [selectedItemData, setSelectedItemData] = useState([]);
  const [addressTransferMany, setAddressTransferMany] = useState(null);
  //prolly delete later
  const [addressTransfer, setAddressTransfer] = useState("");
  const [transferAmount, setTransferAmount] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const step = window.innerWidth < 1030 ? 9 : 21;
  const {
    isConnected,
    collectionAmount,
    addressTransferSingle,
    addAddressToTransfer,
    addCollectionAmount,
    itemData,
    addItemData,
    addOrdinalIdView,
    mintPrice,
    addMintPrice,
  } = useContext(AppContext);

  const handleTransferSingle = async (id) => {
    if (!addressTransferSingle) {
      return;
    }
    try {
      await transferSingle(addressTransferSingle, id);
      const filteredItemData = itemData.filter((item) => item.id !== id);
      addItemData(filteredItemData);
      addAddressToTransfer("");
      toast.success("Ordinal Transferred Successfully!");
    } catch (err) {
      toast.error("Oops, looks like there's an error");
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
            key={`sdf${i}`}
            className="invisible rounded-2xl overflow-hidden relative"
          >
            <input type="checkbox" className="absolute top-5 right-5" />
            <Link to="/dapp/ordinal" className="block">
              <div className="relative">
                <img src={bgplc} alt="" loading="lazy" />
                <img
                  className="min-w-full absolute top-0 left-0"
                  src={placeholder}
                  loading="lazy"
                />
              </div>

              <div className="bg-[#2d325b] px-5 py-5">
                <p className="font-bold text-white">#{0}</p>
              </div>
            </Link>
          </div>
        );
      } else {
        arr.push(
          <div
            key={itemData[i].id}
            className=" rounded-2xl overflow-hidden relative"
          >
            <input
              onChange={(e) => handleSelection(e, itemData[i])}
              type="checkbox"
              className="absolute top-1 right-2 z-10"
              checked={selectedItemData.includes(itemData[i])}
            />
            <Link
              onClick={() => addOrdinalIdView(itemData[i].id)}
              to="/dapp/ordinal"
              className="block"
            >
              {/* <div className="bg-[#7f84a8] w-[133px] h-[133px] 2xl:w-[148px] 2xl:h-[148px]"> */}
              <div className="relative">
                <img src={bgplc} alt="" loading="lazy" />
                <img
                  className="min-w-full absolute top-0 left-0"
                  src={itemData[i].img}
                  loading="lazy"
                />
              </div>

              <div className="bg-[#2d325b] px-5 py-5">
                <p className="font-bold text-white">#{itemData[i].id}</p>
              </div>
            </Link>
          </div>
        );
      }
    }
    return arr;
  };

  const loadMore = (start) => {
    setRenderFrom(start * step - step);
  };

  const paginationButton = () => {
    const buttonCount = Math.ceil(itemData.length / step);
    let arr = [];
    for (let i = 0; i < buttonCount; i++) {
      arr.push(
        <button
          key={itemData[i].id}
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

  const cancelSingleSelected = (id) => {
    const filteredItemData = selectedItemData.filter((item) => item.id !== id);
    setSelectedItemData(filteredItemData);
  };

  const selectedOrdinals = () => {
    return selectedItemData.map((item) => {
      return (
        <div className="w-8 lg:w-16 relative" key={item.id}>
          <div
            onClick={() => cancelSingleSelected(item.id)}
            className="absolute hover:bg-red-600 top-0 border border-white right-0 w-7 h-7 bg-custom-transparent rounded-full flex items-center justify-center text-white font-bold text-base cursor-pointer"
          >
            X
          </div>
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
    transfer(addressTransfer, transferAmount).then(() => {
      stateUpdate(addCollectionAmount, addItemData, addMintPrice).then(() => {
        toast.success("Ordinals Successfully Transfered!");
      });
    });
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
    transferMany(addressTransferMany, idToSend).then(() => {
      stateUpdate(addCollectionAmount, addItemData, addMintPrice).then(() => {
        setSelectedItemData([]);
        toast.success("Ordinals Successfully Transfered!");
      });
    });
  };

  return (
    <div className="min-h-screen py-5">
      <div className="mt-5 w-10/12 max-w-[1300px] mx-auto my-0">
        {isConnected && (
          <>
            <div className="linear px-4 py-3 mb-7 rounded-2xl block lg:flex items-center">
              <img src={ethPanda} className="hidden lg:block h-16" alt="" />
              <div className="w-full mb-2 lg:mb-0 lg:w-fit px-5 py-2 pinky-linear justify-center rounded-full lg:ml-5 flex items-center mr-10">
                <h2 className="text-white font-bold text-xs lg:text-sm">
                  Holdings: {collectionAmount}
                </h2>
              </div>

              <input
                type="number"
                placeholder="Amount"
                className="mb-2 lg:mb-0 w-full lg:w-24 px-6 py-2 rounded-full mr-4 text-xs "
                onChange={(e) => setTransferAmount(Number(e.target.value))}
              />
              <input
                type="text"
                placeholder="Transfer to"
                className="mb-2 lg:mb-0 w-full lg:w-56 px-6 py-2 rounded-full mr-4 text-xs "
                onChange={(e) => setAddressTransfer(e.target.value)}
              />

              <button onClick={handleTransfer} className={style.btnUniversal}>
                Transfer Without Selecting
              </button>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-7 gap-6 rounded-xl">
              {collectionList()}
            </div>
            <div className="flex  px-1 dir-rtl">
              <div className="mt-7 overflow-x-auto custom-scroll flex mb-5 dir-ltr py-2">
                {paginationButton()}
              </div>
            </div>

            {/* Selected item ============================== */}
            <div className="bg-[#2d325b] p-5 lg:p-10 rounded-3xl mt-7">
              <h1 className="text-indigo-300 mb-5 text-sm font-bold">
                Selected Ordinals:
              </h1>

              <button
                onClick={() => setSelectedItemData([])}
                className="text-white text-xs font-bold bg-[#f65171] hover:bg-red-600 px-5 py-2 rounded-full mb-3"
              >
                Cancel All
              </button>
              <div className="grid grid-cols-4 lg:grid-cols-10 gap-3 border border-gray-700 p-4 lg:p-8 rounded-3xl mb-4 lg:mb-10">
                {selectedOrdinals()}
              </div>
              <input
                type="text"
                placeholder="Transfer to"
                className="lg:mb-0 mb-3 w-full lg:w-96 px-6 py-2 rounded-full mr-4 text-sm"
                onChange={(e) => setAddressTransferMany(e.target.value)}
              />
              <button
                onClick={handleTransferMany}
                className={style.btnUniversal}
              >
                Transfer
              </button>
              <p className="text-xs text-gray-200 mt-3 italic">
                Keep in mind, the more you transfer the more gas you'll pay.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Collections;
