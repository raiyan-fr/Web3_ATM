import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({
        method: "eth_requestAccounts",
      });
      handleAccount(accounts);

      // once the wallet is set, get a reference to our deployed contract
      getATMContract();
    } catch (error) {
      console.error("Error connecting account:", error.message);
    }
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        let tx = await atm.deposit(1);
        await tx.wait();
        setDepositSuccess(true);
        setWithdrawSuccess(false);
        getBalance();
      } catch (error) {
        console.error("Deposit error:", error.message);
        setDepositSuccess(false);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        let tx = await atm.withdraw(1);
        await tx.wait();
        setWithdrawSuccess(true);
        setDepositSuccess(false);
        getBalance();
      } catch (error) {
        console.error("Withdrawal error:", error.message);
        setWithdrawSuccess(false);
      }
    }
  };

  const initUser = () => {
    // Check to see if the user has Metamask
    if (!ethWallet) {
      return (
        <div className="init-container">
          <p>Please install Metamask to use this ATM.</p>
        </div>
      );
    }

    // Check to see if the user is connected. If not, connect to their account
    if (!account) {
      return (
        <div className="init-container">
          <button onClick={connectAccount}>Connect Metamask</button>
          <p className="popup-comment">
            Connect your Metamask wallet to proceed.
          </p>
        </div>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="user-container">
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <div className="buttons-container">
          <button onClick={deposit} className="action-button">
            Deposit 1 ETH
          </button>
          <button onClick={withdraw} className="action-button">
            Withdraw 1 ETH
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Raiyan's ATM!</h1>
      </header>
      <div className="content">
        {initUser()}
        <div className="animation-container">
          <p className="animated-text">
            Hello Everyone! Welcome to my ATM Model
          </p>
        </div>
      </div>
      <div className="popup-comments">
        {depositSuccess && (
          <p className="popup-comment success">Deposit successful!</p>
        )}
        {withdrawSuccess && (
          <p className="popup-comment success">Withdrawal successful!</p>
        )}
      </div>
      <style jsx>
        {`
          /* General styling */
          body {
            font-family: "Arial", sans-serif;
            margin: 0;
            padding: 0;
          }

          /* Container styling */
          .container {
            text-align: center;
            padding: 20px;
            background: linear-gradient(to right, #e67e22, #333);
          }

          /* Header styling */
          header {
            background-color: #e67e22;
            padding: 20px;
            color: black;
            border-radius: 10px;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          }

          /* Content styling */
          .content {
            border: 1px solid #333;
            padding: 20px;
            border-radius: 10px;
            background-color: #333;
            color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          }

          /* Initialization container styling */
          .init-container {
            margin-top: 20px;
            text-align: center;
          }

          /* User container styling */
          .user-container {
            margin-top: 20px;
          }

          /* Buttons container styling */
          .buttons-container {
            display: flex;
            justify-content: center;
            margin-top: 15px;
          }

          /* Action button styling */
          .action-button {
            background-color: #f39c12;
            padding: 15px 30px;
            margin: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            color: white;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          .action-button:hover {
            background-color: #d35400;
            transform: scale(1.05);
          }

          /* Animation container styling */
          .animation-container {
            margin-top: 20px;
            margin-bottom: 20px;
            overflow: hidden;
          }

          /* Animated text styling */
          .animated-text {
            color: #f39c12;
            font-size: 24px;
            font-weight: bold;
            animation: moveText 5s infinite;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }

          @keyframes moveText {
            0% {
              transform: translateX(50%);
            }
            10% {
              transform: translateX(-10%);
            }
          }

          /* Popup comments container styling */
          .popup-comments {
            text-align: center;
          }

          /* Popup comment styling */
          .popup-comment {
            background-color: #e74c3c;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            font-size: 16px;
            display: inline-block;
          }

          /* Success popup comment styling */
          .popup-comment.success {
            background-color: #2ecc71;
          }
        `}
      </style>
    </main>
  );
}
