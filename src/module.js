import { ethers } from "ethers";
import { contractAddress, contractABI } from "./constant";

const provider = new ethers.BrowserProvider(window.ethereum);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export const initialStateUpdate = async (
  account,
  addConnection,
  addAddress,
  addCollectionAmount,
  addTokenIds,
  setDataImg,
  addItemData
) => {
  const tokenHoldings = await contract.getAddressToIds(account);

  const arr = [];
  tokenHoldings.map((item) => {
    arr.push(ethers.toNumber(item));
  });

  addConnection(true);
  addAddress(account);
  addCollectionAmount(arr.length);
  function compareNumbers(a, b) {
    return a.id - b.id;
  }
  // console.log(arr);

  addTokenIds(arr);
  const itemData = [];
  let promises = [];
  for (let i = 0; i < tokenHoldings.length; i++) {
    promises.push(
      `https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${ethers.toNumber(
        tokenHoldings[i]
      )}`
    );
    itemData.push({ id: ethers.toNumber(tokenHoldings[i]) });
  }

  Promise.all(
    promises.map((res) => {
      return fetch(res)
        .then((response) => {
          return response.json();
        })
        .then((data) => data);
    })
  ).then((value) => {
    const arrNew = [];
    value.map((item, index) => {
      //when uploading to IPFS, make sure to include id
      //so you can read the value and update itemData accordingly
      //or use name but give it stringify number, like so, name: "1"
      const str = item.image.slice(7);
      const img = `https://ipfs.io/ipfs/${str}`;
      // console.log(img);
      //index will be changed by item.id or Number(item.name)
      //find the coresponding id

      // itemData.forEach((obj, idx) => {
      //   if (obj.id === index) {
      //     itemData[idx].img = img;
      //   }
      // });
      // itemData[`${index}`] = img;
      //for now just add as is
      itemData[index].img = img;
      arrNew.push(img);
    });
    // itemData.sort(compareNumbers);
    addItemData(itemData);
    setDataImg(arrNew);
  });

  return true;
};

export const stateUpdate = async (
  account,
  addCollectionAmount,
  addTokenIds
) => {
  const tokenHoldings = await contract.getAddressToIds(account);
  const arr = [];
  tokenHoldings.map((item) => {
    arr.push(ethers.toNumber(item));
  });
  addCollectionAmount(tokenHoldings.length);
  addTokenIds(arr);
  return {
    tokenIds: arr,
  };
};

export const transferSingle = async (recipient, id) => {
  // console.log(recipient, id);
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  const tx = await contractSigned.transferSingle(recipient, id);

  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
  //do state update
  return response;
};

export const transfer = async (recipient, amount) => {
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  const tx = await contractSigned.transfer(recipient, amount);
  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
  //do state update
  return response;
};

export const mint = async () => {
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  const tx = await contractSigned.mint({ value: ethers.parseEther("0.02") });
  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
  //do state update
  return response;
};

export const mintMany = async (amount) => {
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  const pricePaid = amount * 0.02;
  const tx = await contractSigned.mintMany(amount, {
    value: ethers.parseEther(`${pricePaid}`),
  });
  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
  //do state update
  return response;
};

export const transferMany = async (recipient, ids) => {
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  const tx = await contractSigned.transferMany(recipient, ids);
  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
  //do state update
  return response;
};
