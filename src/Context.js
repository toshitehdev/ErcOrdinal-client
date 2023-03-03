import { createContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [collectionAmount, setCollectionAmount] = useState(0);
  const [tokenIds, setTokenIds] = useState([]);
  const [addressTransferSingle, setAddressTransferSingle] = useState("");
  const [dataImg, setDataImg] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [ordinalIdView, setOrdinalIdView] = useState(0);
  const [tokenCounter, setTokenCounter] = useState(0);
  const [mintPrice, setMintPrice] = useState(0);

  const addConnection = (param) => {
    setIsConnected(param);
  };
  const addAddress = (param) => {
    setAddress(param);
  };
  const addCollectionAmount = (param) => {
    setCollectionAmount(param);
  };
  const addTokenIds = (param) => {
    setTokenIds(param);
  };
  const addAddressToTransfer = (param) => {
    setAddressTransferSingle(param);
  };
  const addDataImg = (param) => {
    setDataImg(param);
  };
  const addItemData = (param) => {
    setItemData(param);
  };
  const addOrdinalIdView = (param) => {
    setOrdinalIdView(param);
  };
  const addTokenCounter = (param) => {
    setTokenCounter(param);
  };
  const addMintPrice = (param) => {
    setMintPrice(param);
  };

  const param = {
    isConnected,
    address,
    collectionAmount,
    tokenIds,
    addressTransferSingle,
    addConnection,
    addAddress,
    addCollectionAmount,
    addTokenIds,
    addAddressToTransfer,
    dataImg,
    addDataImg,
    itemData,
    addItemData,
    ordinalIdView,
    addOrdinalIdView,
    addTokenCounter,
    tokenCounter,
    addMintPrice,
    mintPrice,
  };

  return <AppContext.Provider value={param}>{children}</AppContext.Provider>;
}

export default AppContext;
