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
    <div className="min-h-screen w-full p-14 text-white">
      <div className="max-1200 bg-custom-black p-16 mx-auto my-0 rounded-3xl">
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
        <div className="w-3/4 mx-auto my-0 border border-gray-700 rounded-xl overflow-hidden">
          <div className="w-80 mx-auto my-0 p-5">
            <img src={singleImg} />
          </div>

          <div className="bg-light-black p-10">
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
