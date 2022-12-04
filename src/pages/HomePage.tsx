import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ConnectWeb3AuthButton from "../components/ConnectWeb3AuthButton";
import Form from "../components/Form";
import GuardianWeb3AuthConnect from "../components/GuardianWeb3AuthConnect";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import WalletContract from "../services/contract";
import { useWeb3Auth } from "../services/web3auth";
import { getUserData } from "../utils/helpers";

function HomePage() {
  const { web3Auth, provider, address, balance, sendTransaction, readContract, writeContract } = useWeb3Auth();
  const [walletOwner, setWalletOwner] = useState("");
  const [smartContractWallet, setSmartContractWallet] = useState("");
  const [willAccount, setWillAccount] = useState("");

  const navigate = useNavigate();

  const [requestId, setRequestId] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function init() {
      const userData = getUserData(address);
      if (userData.address) {
        const wallet = new WalletContract();
        await wallet.init(web3Auth.provider, address);
        setIsActive(true);
        setSmartContractWallet(userData.address);
        const owner = await wallet.getOwner();
        setWalletOwner(owner);
      }
    }
    init();
  }, [address]);

  useEffect(() => {
    async function init() {
      const userData = getUserData(address);
      if (userData.address) {
        const wallet = new WalletContract();
        await wallet.init(web3Auth.provider, address);
        setIsActive(true);
        setSmartContractWallet(userData.address);
        const owner = await wallet.getOwner();
        setWalletOwner(owner);

        const willAcc = await wallet.getWillAccount();
        setWillAccount(willAcc);
      }
    }
    init();
  }, []);

  const activateAccount = async () => {
    const wallet = new WalletContract();
    await wallet.init(web3Auth.provider, address);
    const userData = getUserData(address);
    if (userData.address) {
      setIsActive(true);
      setSmartContractWallet(userData.address);
      const owner = await wallet.getOwner();
      setWalletOwner(owner);
    }
  };

  const checkRequestId = () => {
    const url = new URL(window.location.href);
    const reqId = url.searchParams.get("uuid");
    setRequestId(reqId);
  };
  useEffect(() => {
    // if (!provider) navigate("/");
    checkRequestId();
  }, []);

  const formDetails = [
    {
      label: "Address",
      input: address as string,
      readOnly: true,
    },
    {
      label: "Balance",
      input: balance as string,
      readOnly: true,
    },
    {
      label: "Will Acc",
      input: willAccount as string,
      readOnly: true,
    },
    {
      label: "Wallet Owner",
      input: walletOwner as string,
      readOnly: true,
    },
    {
      label: "Smart Contract Wallet",
      input: smartContractWallet as string,
      readOnly: true,
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0 bg-background-secondary text-white">
      {provider ? (
        <div className="flex flex-col h-screen z-0">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <div className=" w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-flex-start">
              <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Welcome to TrueResQ</h1>
              <div className="py-16 w-11/12 ">
                <Form heading="Your Primary Wallet Details" formDetails={formDetails}>
                  {!isActive && (
                    <button
                      className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                      style={{ backgroundColor: "#599cb3" }}
                      onClick={() => activateAccount()}
                    >
                      Activate account
                    </button>
                  )}
                  {/* <button
                    className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "#599cb3" }}
                    onClick={() => readContract()}
                  >
                    Read Contract
                  </button>
                  <button
                    className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "#599cb3" }}
                    onClick={() => writeContract()}
                  >
                    Write Contract
                  </button> */}
                </Form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-center overflow-scroll p-4">
          <h1 className="text-2xl font-bold text-center sm:text-5xl">Welcome to TrueResQ</h1>
          <h2 className="max-w-md mx-auto mt-2 text-center sm:text-2xl text-gray-300">Non-custodial Social Recovery and Inheritance Protocol </h2>

          {requestId ? (
            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">Please login to become a guardian.</p>
          ) : (
            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">Create a new wallet or connect your existing wallet.</p>
          )}
          <div className="flex-col flex-row mt-10 items-center">{requestId ? <GuardianWeb3AuthConnect /> : <ConnectWeb3AuthButton />}</div>
          <p
            className="max-w-md mx-auto mt-12 text-center text-gray-300"
            onClick={() => {
              navigate("/recovery");
            }}
          >
            Forgot account?
          </p>
        </div>
      )}
    </main>
  );
}

export default HomePage;
