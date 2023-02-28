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
  };

  return <AppContext.Provider value={param}>{children}</AppContext.Provider>;
}

export default AppContext;
