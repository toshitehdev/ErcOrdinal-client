import { ethers } from "ethers";
import { contractAddress, contractABI, contractNftABI } from "./constant";

const provider = new ethers.BrowserProvider(window.ethereum);
const contract = new ethers.Contract(contractAddress, contractABI, provider);
const nftAddress = "0x6c107b1f1e222d02fd0b7a2f78fe5c1b42b9c733";
const contractNft = new ethers.Contract(nftAddress, contractNftABI, provider);

async function fetchIPFS(tokenHoldings) {
  let promises = [];
  const itemData = [];
  for (let i = 0; i < tokenHoldings.length; i++) {
    promises.push(
      `https://ipfs.io/ipfs/bafybeibqknpxt2dc2s3o5ulfsvqognymzzaot2xk6hkwonhq3qmyerljfe/${ethers.toNumber(
        tokenHoldings[i]
      )}.json`
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
      return true;
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

export const mintMany = async (amount, addMintPrice, cb) => {
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
    await tx.wait();
    const response = await provider.waitForTransaction(tx.hash);
    // await response.confirmations();
    // console.log(response.logs);
    const mintedIds = [];
    for (let i = 0; i < response.logs.length; i++) {
      let logs = contract.interface.parseLog({
        data: response.logs[i].data,
        topics: response.logs[i].topics,
      });
      if (logs.name == "Mint") {
        let mintedId = ethers.toNumber(logs.args["1"]) - 1;
        mintedIds.push(mintedId);
      }
      if (logs.name == "EligibleBounty") {
        //toast when user won a bounty
        cb();
      }
    }
    addMintPrice(mint_price);
    return mintedIds;
  } catch (error) {
    console.log(error);
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
    `https://ipfs.io/ipfs/bafybeibqknpxt2dc2s3o5ulfsvqognymzzaot2xk6hkwonhq3qmyerljfe/${id}.json`
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
export const idIsEligible = async (
  setClaimedId,
  setUnclaimedId,
  setIsExpiredId,
  fetchFromClaim,
  id
) => {
  // const rr = await contract.free_mint_allocation();
  // const uu = await contract.free_mint_allocation();
  // const tk = await contract.token_counter();

  // console.log(rr);
  const url =
    process.env.NODE_ENV == "development"
      ? process.env.REACT_APP_LOCAL_FETCH
      : process.env.REACT_APP_REMOTE_FETCH;
  const fetchId = await fetch(
    `${fetchFromClaim ? `${url}claim` : `${url}logs`}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ id }),
    }
  );
  const resJson = await fetchId.json();
  const dataArray = resJson.map((item) => {
    return {
      id: item.id,
      is_eligible: item.is_eligible,
      is_claimed: item.is_claimed,
      prize_amount: ethers.toNumber(item.prize_amount),
      from_claiming: item.from_claiming,
    };
  });
  const unclaimed = dataArray.filter((item) => item.is_claimed == false);
  const claimed = dataArray.filter((item) => item.is_claimed == true);
  const expired = dataArray.filter((item) => item.from_claiming == true);
  setUnclaimedId(unclaimed);
  setClaimedId(claimed);
  setIsExpiredId(expired);
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

  const response = await provider.waitForTransaction(tx.hash);
  // await response.confirmations(1);
  //do state update, update collection
  return response;
};

export const switchToErc721 = async (id) => {
  const signer = await provider.getSigner();
  const contractNftSigned = new ethers.Contract(
    nftAddress,
    contractNftABI,
    signer
  );

  const tx = await contractNftSigned.switchToErc721(id);
  await tx.wait();
  const response = await provider.waitForTransaction(tx.hash);
  // console.log(response);
  return response;
};

export const switchToErcord = async (id) => {
  const signer = await provider.getSigner();
  const contractNftSigned = new ethers.Contract(
    nftAddress,
    contractNftABI,
    signer
  );

  const tx = await contractNftSigned.switchToErcord(id);
  await tx.wait();
  const response = await provider.waitForTransaction(tx.hash);
  // console.log(response);
  return response;
};

export const claimFromERC721 = async (id) => {
  const signer = await provider.getSigner();
  const contractNftSigned = new ethers.Contract(
    nftAddress,
    contractNftABI,
    signer
  );

  const tx = await contractNftSigned.claimFreeMint(id);
  await tx.wait();
  const response = await provider.waitForTransaction(tx.hash);
  // console.log(response);
  return response;
};
