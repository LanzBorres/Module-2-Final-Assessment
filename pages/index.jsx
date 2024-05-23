import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import Actions from "./actions";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async (amount) => {
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async (amount) => {
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask

    if (!ethWallet) {
      return
      <div> <p>Please install Metamask in order to use this ATM.</p></div>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return  <div className="flex justify-center"><button className="bg-red-500 p-2 text-white text-lg rounded shadow" onClick={connectAccount}>Please connect your Metamask wallet</button></div>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div className="">
        <div className="flex flex-col justify-center">
          <p className="flex justify-center font-thin">Your Account: {account}</p>
          <p className="flex justify-center font-bold text-lg">Your Balance: {balance}</p>
        </div>
        <div className=" flex justify-center mt-5 mb-10">
          {/* <button className="bg-red-400 outline-none hover:bg-red-700 text-white rounded p-1 px-3  shadow" onClick={deposit}>Deposit 1 ETH</button> */}
          {/* <button className="bg-red-400 ml-20  outline-none hover:bg-red-700 text-white rounded p-1 px-3 shadow" onClick={withdraw}>Withdraw 1 ETH</button> */}
          <Actions withdraw={withdraw} deposit={deposit} /> 
        </div>
      </div>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (

    <main className="container">
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="h-screen w-screen bg-blue-400 flex justify-center  items-center">
        <div className="bg-white/50 rounded-xl shadow shadow-2xl p-4">
          <header><h1 className="flex justify-center mt-5 mb-5 text-4xl font-bold">Welcome to the&#160;<span className="text-red-700"> Metacrafters ATM!</span></h1></header>
          {initUser()}
        </div>
      </div>
    </main> 
  )
}
