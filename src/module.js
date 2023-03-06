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
        // console.log(item.attributes);
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
  addItemData,
  addMintPrice,
  addLastMintedId
) => {
  try {
    let lastMintedId = undefined;
    const tokenHoldings = await contract.getAddressToIds(account);
    const itemData = await fetchIPFS(tokenHoldings);
    const getPrice = await contract.mint_price();
    const token_counter = await contract.token_counter();
    lastMintedId = ethers.toNumber(token_counter) - 1;
    addConnection(true);
    addAddress(account);
    addCollectionAmount(tokenHoldings.length);
    addItemData(itemData);
    // addMintPrice(ethers.toNumber(mint_price));
    const stringify = getPrice.toString();
    const mint_price = ethers.formatEther(stringify);
    addMintPrice(mint_price);
    // console.log(mint_price);
    addLastMintedId(lastMintedId);
    contract.on("Mint", async (address, id) => {
      lastMintedId = ethers.toNumber(id) - 1;
      addLastMintedId(lastMintedId);
      const getPrice = await contract.mint_price();
      const stringify = getPrice.toString();
      const mint_price = ethers.formatEther(stringify);
      addMintPrice(mint_price);
    });
  } catch (error) {
    console.log(error);
  }
};

export const stateUpdate = async (
  addCollectionAmount,
  addItemData,
  addMintPrice
) => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const account = accounts[0];
    if (accounts.length > 0) {
      const tokenHoldings = await contract.getAddressToIds(account);
      const itemData = await fetchIPFS(tokenHoldings);
      const getPrice = await contract.mint_price();
      const stringify = getPrice.toString();
      const mint_price = ethers.formatEther(stringify);
      addMintPrice(mint_price);
      addCollectionAmount(tokenHoldings.length);
      addItemData(itemData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const mint = async (addMintPrice) => {
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  const getPrice = await contract.mint_price();
  const stringify = getPrice.toString();
  const mint_price = ethers.formatEther(stringify);

  const tx = await contractSigned.mint({
    value: ethers.parseEther(`${mint_price}`),
  });

  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
  const logs = contract.interface.parseLog(response.logs[0]);
  //this is -1 because token_counter start from 1, tokenId start from 0
  const mintedId = ethers.toNumber(logs.args["1"]) - 1;
  addMintPrice(mint_price);
  return mintedId;
};

export const mintMany = async (amount, addMintPrice) => {
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  try {
    const getPrice = await contract.mint_price();
    const stringify = getPrice.toString();
    const mint_price = ethers.formatEther(stringify);
    const priceToPay = ethers.toBigInt(getPrice) * ethers.toBigInt(amount);
    const p = ethers.formatEther(priceToPay);

    const tx = await contractSigned.mintMany(amount, {
      value: ethers.parseEther(`${p}`),
    });
    const response = await provider.getTransactionReceipt(tx.hash);
    await response.confirmations();
    const mintedIds = [];
    for (let i = 0; i < response.logs.length; i++) {
      let logs = contract.interface.parseLog(response.logs[i]);
      let mintedId = ethers.toNumber(logs.args["1"]) - 1;
      mintedIds.push(mintedId);
    }
    addMintPrice(mint_price);
    return mintedIds;
  } catch (error) {
    // console.log(error);s
    throw error;
  }
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

export const getTokenData = async (id) => {
  //read from the chain first
  //return nothing, dont do nothing
  const fetchData = await fetch(
    `https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${id}`
  );
  const jsonice = await fetchData.json();
  const str = jsonice.image.slice(7);
  const img = `https://ipfs.io/ipfs/${str}`;
  // console.log(jsonice.attributes);
  return {
    attributes: jsonice.attributes,
    img,
  };
};

export const withdrawMintSale = async () => {
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  const tx = await contractSigned.withdrawMintSale();

  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
  //do state update
  return response;
};

export const setEligibleIds = async (ids, amount) => {
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  const tx = await contractSigned.setEligibleIds(ids, amount);
  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
};

//all eligible id, claimed and not claimed
export const idIsEligible = async () => {
  const arr = [160, 165, 180];
  const promises = [];
  arr.map((item) => {
    const tx = contract.idIsEligible(item);
    const txObj = {
      tx,
      txId: item,
    };
    promises.push(txObj);
  });

  const uu = Promise.all(
    promises.map((res) => {
      return res.tx.then((response) => {
        return {
          response,
          id: res.txId,
        };
      });
    })
  );
  const response = await uu;

  const result = response.map((item) => {
    if (item.response.is_eligible) {
      return {
        id: item.id,
        is_eligible: item.response.is_eligible,
        is_claimed: item.response.is_claimed,
        prize_amount: ethers.toNumber(item.response.prize_amount),
      };
    }
  });
  return result.filter((item) => item);
};

export const subscribeBountyAdded = async () => {
  contract.on("EligibleBounty", async (minter, id, prize_amount) => {
    const idWind = {
      minter,
      id,
      prize_amount,
    };
    console.log(idWind);
  });
};

export const claimBounty = async (id) => {
  // console.log(recipient, id);
  const signer = await provider.getSigner();
  const contractSigned = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  const tx = await contractSigned.claimBounty(id);

  const response = await provider.getTransactionReceipt(tx.hash);
  await response.confirmations();
  //do state update, update collection
  return response;
};
