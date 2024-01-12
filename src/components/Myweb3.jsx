import Web3 from "web3";
import { useState } from "react";

const Myweb3 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState(null);

  const onConnect = async () => {
    try {
      // Check if the browser has the Ethereum object (MetaMask)
      if (window.ethereum) {
        // Request user permission to connect to their Ethereum accounts
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create a new Web3 instance using the Ethereum object
        const web3 = new Web3(window.ethereum);
        console.log("web3", web3);

        // Get the user's Ethereum accounts
        const userAccount = await web3.eth.getAccounts();
        const account = userAccount[0];

        // Set the user's Ethereum address
        setAddress(account);
        console.log("accounts", account);

        // Get the Ethereum balance of the user's account
        let ethBalance = await web3.eth.getBalance(account);

        // Convert the balance from wei to ether
        const etherBalance = web3.utils.fromWei(ethBalance, "ether");

        // Set the user's balance in ether
        setBalance(etherBalance);
        console.log("balance", ethBalance);

        // Set the connection status to true
        setIsConnected(true);
      } else {
        // If the Ethereum object is not present, log a message
        console.log(
          "Non-ethereum browser detected. You should install Metamask."
        );
      }
    } catch (err) {
      // Handle any errors that occur during the process
      console.log(err);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
  };

  return (
    <div>
      <h1>React and web3 js</h1>
      {isConnected ? (
        <>
          <div>wallet Address: {address}</div>
          <div>Balance: {Number(balance).toFixed(3)}</div>
          <button onClick={disconnect}>disconnect to metamask</button>
        </>
      ) : (
        <button onClick={onConnect}>connect to metamask</button>
      )}
    </div>
  );
};

export default Myweb3;
