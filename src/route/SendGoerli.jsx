import React, { useState, useEffect } from "react";

import { ethers } from "ethers";
import { style } from "./style";

function SendGoerli() {
  const provider = new ethers.BrowserProvider(window.ethereum);

  const [recipientAddress, setRecipientAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [addressArr, setAddressArr] = useState([]);
  useEffect(() => {
    const storage = localStorage.getItem("goerlisent");
    if (storage) {
      setAddressArr(JSON.parse(storage));
    }
  }, []);
  async function sendGoerli() {
    if (!recipientAddress) {
      return;
    }
    const storage = localStorage.getItem("goerlisent");
    if (storage && storage.includes(recipientAddress)) {
      alert("Adress already got Goerli");
      return;
    }
    try {
      setIsSending(true);
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const s = ethers.toBeHex(ethers.parseEther("1"));
      const account = accounts[0];
      if (account) {
        const transactionParameters = {
          to: recipientAddress,
          from: account,
          value: s,
        };
        const tx = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        await provider.waitForTransaction(tx);

        const arr = JSON.parse(localStorage.getItem("goerlisent"));
        if (!arr) {
          localStorage.setItem(
            "goerlisent",
            JSON.stringify([recipientAddress])
          );
          setAddressArr([recipientAddress]);
          setIsSending(false);
          setRecipientAddress("");
        }
        if (arr && !arr.includes(recipientAddress)) {
          arr.push(recipientAddress);
          localStorage.setItem("goerlisent", JSON.stringify(arr));
          setAddressArr(arr);
          setIsSending(false);
          setRecipientAddress("");
        }
      }
    } catch (error) {
      setIsSending(false);

      console.log(error);
    }
  }
  const renderSent = () => {
    if (addressArr.length > 0) {
      return addressArr.map((item, index) => {
        return (
          <div key={item}>
            <p>
              {index + 1}: {item}
            </p>
          </div>
        );
      });
    }
    return;
  };
  return (
    <div className="p-10 w-3/5">
      <p>Send goerli</p>
      <input
        onChange={(e) => {
          setRecipientAddress(e.target.value);
        }}
        className="block my-5 w-full border border-gray-700 px-2 py-2"
        type="text"
        placeholder="Address"
        value={recipientAddress}
      />
      <button onClick={sendGoerli} className={style.btnUniversal}>
        {isSending ? "Sending..." : "Send"}
      </button>
      <div className="mt-5">{renderSent()}</div>
    </div>
  );
}

export default SendGoerli;
