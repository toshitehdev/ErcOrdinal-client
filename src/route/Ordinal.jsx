import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context";
import { getTokenData } from "../module";

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
            <p>
              {`${item.trait_type}`} : {`${item.value}`}
            </p>
          </div>
        );
      });
    }
  };
  return (
    <div className="min-h-screen w-full p-14 text-white">
      <form onSubmit={(e) => handleTokenFetch(e)}>
        <input
          type="number"
          placeholder="Token ID"
          className="block mt-10 px-5 py-2 mb-3 rounded-full text-lg text-black font-bold"
          onChange={(e) => setSelectedId(e.target.value)}
          defaultValue={ordinalIdView}
        />
      </form>
      <img src={singleImg} className="w-80" />
      {renderAttributes()}
    </div>
  );
}

export default Ordinal;
