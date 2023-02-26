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
  setDataImg
) => {
  const tokenHoldings = await contract.getAddressToIds(account);
  const arr = [];
  tokenHoldings.map((item) => {
    arr.push(ethers.toNumber(item));
  });
  addConnection(true);
  addAddress(account);
  addCollectionAmount(arr.length);
  addTokenIds(arr);
  let promises = [];
  for (let i = 0; i < arr.length; i++) {
    promises.push(
      `https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${arr[i]}`
    );
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
    value.map((item) => {
      const str = item.image.slice(7);
      const img = `https://ipfs.io/ipfs/${str}`;
      arrNew.push(img);
    });
    // console.log(arr);
    setDataImg(arrNew);
  });

  return {
    tokenIds: arr,
  };
};

export const stateUpdate = async (account) => {
  const tokenHoldings = await contract.getAddressToIds(account);

  const arr = [];
  tokenHoldings.map((item) => {
    arr.push(ethers.toNumber(item));
  });
  return {
    tokenIds: arr,
  };
};

export const transferSingle = async (recipient, id) => {
  console.log(recipient, id);
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
  console.log("success");
};

// //7,8,98,57, 33,44,78
// (1,2,3,4,5,6,7)
// //length = 7
// //loop 2x start i = 1
// //uint256 idx = senderHoldingsLength - i;
// //uint256 token_id = addressToTokenIds[_sender][idx];
// // ==========================
// //i=1
// //idToIndex[recipient][adressToId[rec][i-1]].index = recipientlength + i
// ("7"=8, "8"=2, "98"=3, "57"=4, "33"=5, "44"=6, "78"=7)
// //addresToId[recipient].push(addresToId[recipient][i-1]) => 7,8,98,57,33,44,78,7
// //idToIndex[recipient][addressToId[sender][token_id]].index = i
// ("7"=8, "8"=2, "98"=3, "57"=4, "33"=5, "44"=6, "78"=7, "5"=1)
// //addresToId[recipient][i-1] = addressToId[sender][senderlength-1] => 5,8,98,57,33,44,78,7

// //i=2
// //idToIndex[recipient][adressToId[rec][i-1]].index = recipientlength + i
// ("7"=8, "8"=9, "98"=3, "57"=4, "33"=5, "44"=6, "78"=7, "5"=1)
// //addresToId[recipient].push(addresToId[recipient][i-1]) => 5,8,98,57,33,44,78,7,8
// //idToIndex[recipient][addressToId[sender][token_id]].index = i
// ("7"=8, "8"=9, "98"=3, "57"=4, "33"=5, "44"=6, "78"=7, "5"=1, "4"=2)
// //addresToId[recipient][i-1] = 4 => 5,4,98,57,33,44,78,7,8

// //5,4,98,57,7,8

// //send 4,5
// //1,2,3,4,5
