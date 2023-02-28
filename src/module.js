import { ethers } from "ethers";
import { contractAddress, contractABI } from "./constant";

const provider = new ethers.BrowserProvider(window.ethereum);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function fetchIPFS(tokenHoldings) {
  let promises = [];
  const itemData = [];
  for (let i = 0; i < tokenHoldings.length; i++) {
    promises.push(
      `https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${ethers.toNumber(
        tokenHoldings[i]
      )}`
    );
    itemData.push({ id: ethers.toNumber(tokenHoldings[i]) });
  }
  return Promise.all(
    promises.map((res) => {
      return fetch(res)
        .then((response) => {
          return response.json();
        })
        .then((data) => data);
    })
  )
    .then((value) => {
      value.map((item, index) => {
        const str = item.image.slice(7);
        const img = `https://ipfs.io/ipfs/${str}`;
        itemData[index].img = img;
      });
    })
    .then(() => {
      // function compareNumbers(a, b) {
      //   return a.id - b.id;
      // }
      // itemData.sort(compareNumbers);
      return itemData;
    });
}

export const initialStateUpdate = async (
  account,
  addConnection,
  addAddress,
  addCollectionAmount,
  addItemData
) => {
  try {
    const tokenHoldings = await contract.getAddressToIds(account);
    const itemData = await fetchIPFS(tokenHoldings);
    addConnection(true);
    addAddress(account);
    addCollectionAmount(tokenHoldings.length);
    addItemData(itemData);
  } catch (error) {
    console.log(error);
  }
};

export const stateUpdate = async (addCollectionAmount, addItemData) => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const account = accounts[0];
    if (accounts.length > 0) {
      const tokenHoldings = await contract.getAddressToIds(account);
      const itemData = await fetchIPFS(tokenHoldings);
      addCollectionAmount(tokenHoldings.length);
      addItemData(itemData);
    }
  } catch (error) {
    console.log(error);
  }
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
  const logs = contract.interface.parseLog(response.logs[0]);
  //this is -1 because token_counter start from 1, tokenId start from 0
  const mintedId = ethers.toNumber(logs.args["1"]) - 1;
  return mintedId;
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
  const mintedIds = [];
  for (let i = 0; i < response.logs.length; i++) {
    let logs = contract.interface.parseLog(response.logs[i]);
    let mintedId = ethers.toNumber(logs.args["1"]) - 1;
    mintedIds.push(mintedId);
  }
  return mintedIds;
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
