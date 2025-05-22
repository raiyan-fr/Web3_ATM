import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositionHistory, setDepositionHistory] = useState(undefined);
  const [withdrawalHistory, setWithdrawalHistory] = useState(undefined);
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

  const depositHistory = async () => {
    if (atm) {
      try {
        const totalDeposit = await atm.depositHistory();
        setDepositionHistory(totalDeposit);
        console.log("Total Deposit:", totalDeposit);
      } catch (error) {
        console.error("Error getting total deposit amount: ", error.message);
      }
    }
  };
  const withdrawHistory = async () => {
    if (atm) {
      try {
        const totalWithdraw = await atm.withdrawHistory();
        setWithdrawalHistory(totalWithdraw);
        console.log("Total Withdraw:", totalWithdraw);
      } catch (error) {
        console.error("Error getting total withdraw amount: ", error.message);
      }
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
          <p>
            Total Deposited Amount:{" "}
            {depositionHistory === undefined
              ? ""
              : depositionHistory.toNumber()}{" "}
          </p>
          <button onClick={depositHistory} className="history-button">
            Deposit History
          </button>
          <p>
            Total Withdrawn Amount:{" "}
            {withdrawalHistory === undefined
              ? ""
              : withdrawalHistory.toNumber()}{" "}
          </p>
          <button onClick={withdrawHistory} className="history-button">
            Withdraw History
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (depositSuccess || withdrawSuccess) {
      const timer = setTimeout(() => {
        setDepositSuccess(false);
        setWithdrawSuccess(false);
      }, 2000); // 2000ms = 2 seconds

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [depositSuccess, withdrawSuccess]);

  return (
    <main className="container">
      <header>
        <h1>🌟 Raiyan's Next-Gen ATM Interface</h1>
      </header>
      <div className="content">
        {initUser()}
        <div className="animation-container">
          <p className="animated-text">
            🚀 Experience Seamless Blockchain Transactions
          </p>
        </div>
      </div>
      <div className="popup-comments">
        {depositSuccess && (
          <p className="popup-comment success">✅ Deposit Successful!</p>
        )}
        {withdrawSuccess && (
          <p className="popup-comment success">✅ Withdrawal Completed!</p>
        )}
      </div>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap");
      `}</style>
      <style jsx global>{`
        .container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(45deg, #0f0c29, #302b63, #24243e);
          font-family: "Inter", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .container::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: gradientAnim 15s infinite linear;
        }

        @keyframes gradientAnim {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        header h1 {
          margin: 0;
          color: #fff;
          font-weight: 700;
          letter-spacing: -0.5px;
          font-size: 2.2rem;
        }

        .content {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .init-container {
          text-align: center;
          padding: 2rem;
        }

        .init-container button {
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .init-container button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .user-container {
          color: #fff;
        }

        .user-container p {
          font-size: 1.1rem;
          margin: 1rem 0;
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 12px;
          font-family: monospace;
        }

        .buttons-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }

        .action-button {
          background: linear-gradient(45deg, #10b981, #059669);
          border: none;
          padding: 1.2rem;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .buttons-container .action-button:last-child {
          background: linear-gradient(45deg, #ef4444, #dc2626) !important;
          position: relative;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .buttons-container button:not(.action-button) {
          background: none;
          border: 2px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .buttons-container button:not(.action-button):hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .history-button {
          background: linear-gradient(45deg, #7c3aed, #6d28d9); !important;
          border: 2px solid rgba(255, 255, 255, 0.15) !important;
          color: white !important;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .history-button:hover {
          background: linear-gradient(45deg, #6d28d9, #7c3aed); !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }

        .history-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: 0.5s;
        }

        .history-button:hover::before {
          left: 100%;
        }

        .animated-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.2rem;
          text-align: center;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .popup-comment {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: fadeInOut 2s ease-in-out forwards;
          opacity: 0;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          20% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
        }

        .popup-comment.success {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .init-container .popup-comment {
          color: rgba(255, 255, 255, 0.8);
          margin-top: 1rem;
          font-size: 0.9rem;
        }
      `}</style>
    </main>
  );
}
