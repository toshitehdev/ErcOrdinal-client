import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context";
import { getTokenData } from "../module";
import { style } from "./style";

function Ordinal() {
  const { ordinalIdView, addOrdinalIdView } = useContext(AppContext);
  const [selectedId, setSelectedId] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [singleImg, setSingleImg] = useState("");
  useEffect(() => {
    //default to 0, or render nothing as default?
    async function fetchData() {
      const data = await getTokenData(ordinalIdView);
      //   console.log(data);
      setAttributes(data.attributes);
      setSingleImg(data.img);
    }
    fetchData();
  }, []);
  const handleTokenFetch = async (e) => {
    e.preventDefault();
    const data = await getTokenData(selectedId);
    addOrdinalIdView(selectedId);
    setAttributes(data.attributes);
    setSingleImg(data.img);
  };
  const renderAttributes = () => {
    if (attributes.length > 0) {
      return attributes.map((item, index) => {
        return (
          <div key={index}>
            <p className="text-sm leading-7 tracking-wide">
              <span className="text-gray-400 font-bold italic">{`${item.trait_type}`}</span>{" "}
              : {`${item.value}`}
            </p>
          </div>
        );
      });
    }
  };
  return (
    <div className="min-h-screen p-16 text-white relative">
      <div className="w-2/5 bg-[#2d325b] px-5 py-7 pb-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl">
        <form
          onSubmit={(e) => handleTokenFetch(e)}
          className="flex justify-end items-center mb-10"
        >
          <div className="relative w-fit ml-3">
            <input
              type="number"
              placeholder="Ordinal ID"
              className="block px-5 py-2 rounded-full text-xs text-black font-bold"
              onChange={(e) => setSelectedId(e.target.value)}
              defaultValue={ordinalIdView}
            />
            <button
              type="submit"
              className={`absolute top-0 right-0 text-xs  bg-indigo-600 py-2 px-5 italic font-bold text-white rounded-r-full`}
            >
              search
            </button>
          </div>
        </form>
        <div className="w-4/5 mx-auto my-0 border-2 border-[#4f5596] rounded-3xl overflow-hidden">
          <div className="w-64 mx-auto my-0 p-5">
            <img src={singleImg} />
          </div>

          <div className="bg-[#252849] p-10">
            <p className="text-sm font-bold text-indigo-400 mb-3">
              ID: #{ordinalIdView}
            </p>
            {renderAttributes()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ordinal;
