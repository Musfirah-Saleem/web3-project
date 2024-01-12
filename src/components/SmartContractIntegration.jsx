import Web3 from "web3";
import { useState, useEffect } from "react";
import Environment from "../utils/Environment";
import VotingAbi from "../utils/votingAbi.json";

// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")

function SmartContractIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState(null);
  const [votingContract, setVotingContract] = useState();
  const [totalV, setTotalV] = useState(0);
  const [voteStatus, setVoteStatus] = useState(false);

  const onConnect = async () => {
    try {
      if (window.ethereum) {
        let account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const web3 = new Web3(window.ethereum);
        console.log("web3", web3);
        if (account[0]) {
          setAddress(account[0]);
          let ethBalance = await web3.eth.getBalance(account[0]);
          const etherBalance = web3.utils.fromWei(ethBalance, "ether");
          setBalance(etherBalance);
          const Contract = new web3.eth.Contract(
            VotingAbi,
            Environment.VotingContractAddress
          );
          console.log("contract", Contract);
          setVotingContract(Contract);
          setIsConnected(true);
        }
      } else {
        console.log(
          "Non-ethereum browser detected. You should install Metamask."
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const totalVotes = async () => {
    try {
      const result = await votingContract?.methods?.totalVotes().call();
      let convertVal = Number(result);
      setTotalV(convertVal);
    } catch (err) {
      console.log("err", err);
    }
  };

  const hasVoted = async () => {
    try {
      const res = await votingContract?.methods?.hasVoted(address).call();
      setVoteStatus(res);
    } catch (err) {
      console.log("err".err);
    }
  };

  const vote = async () => {
    try {
      let vote = await votingContract.methods.vote().send({ from: address });
      if (vote?.status) {
        totalVotes();
        hasVoted();
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const removevote = async () => {
    try {
      let remove = await votingContract.methods
        .removeVote()
        .send({ from: address });
      if (remove?.status) {
        totalVotes();
        hasVoted();
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    totalVotes();
    hasVoted();
  }, [address, votingContract]);

  const disconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="App">
      <h1>React and web3 js</h1>
      {isConnected ? (
        <>
          <div>wallet Address: {address}</div>
          <div>Balance: {Number(balance).toFixed(3)}</div>
          <h6>Status: {voteStatus ? "voted" : "not voted"}</h6>
          <p>Total Votes:{totalV}</p>
          {!voteStatus ? (
            <button onClick={vote}>Vote </button>
          ) : (
            <button onClick={removevote}>Remove vote</button>
          )}

          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={onConnect}>connect to metamask</button>
      )}
    </div>
  );
}

export default SmartContractIntegration;
