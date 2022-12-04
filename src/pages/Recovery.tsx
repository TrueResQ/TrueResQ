// @ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
import { SocketAddress } from "net";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Form from "../components/Form";
import Table from "../components/GuardianRequestsTable";
import Header from "../components/Header";
import RecoveryGuardians from "../components/RecoveryGuardians";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import { useWeb3Auth } from "../services/web3auth";

function Recovery() {
  const [searchParams] = useSearchParams();
  const [isExistingRecovery, setExistingRecovery] = useState(false);
  const [guardiansView, toggleGuardians] = useState(false);
  const { loginWithRecoveryAccount } = useWeb3Auth();
  const [address, setAddress] = useState<string | any>(null);

  const Buttons = [
    { loginProvider: "google", adapter: "openlogin", label: "Google", backgroundColor: "#dd4b39" },
    { loginProvider: "facebook", adapter: "openlogin", label: "Facebook", backgroundColor: "#3b5998" },
    { loginProvider: "twitter", adapter: "openlogin", label: "Twitter", backgroundColor: "#00acee" },
    { loginProvider: "discord", adapter: "openlogin", label: "Discord", backgroundColor: "#7289da" },
    { loginProvider: "metamask", adapter: "metamask", label: "Metamask", backgroundColor: "#f6851b" },
  ];

  const guardianRequests = [
    {
      email: "himanshu@tor.us",
      address: "0x8b1f49491477e0fb46a29fef53f1ea320d13c349",
      status: "pending", // pending, approved, rejected
      requestId: "1234567890",
    },
  ];
  const generateButton = (loginProvider, adapter, label, backgroundColor, disabled) => {
    return (
      <button
        disabled={disabled}
        className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
        style={{ backgroundColor }}
        onClick={async () => {
          const newAddress = await loginWithRecoveryAccount(loginProvider, adapter);
          console.log(newAddress);
          setAddress(newAddress);
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <main className="flex flex-col h-screen z-0 text-white">
      {address ? (
        <div className="flex flex-1 overflow-hidden">
          <div className=" w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-flex-start overflow-scroll">
            {guardiansView && (
              <FaArrowLeft
                onClick={() => toggleGuardians(!guardiansView)}
                className="flex-start"
                style={{ marginRight: "auto", marginLeft: "10px", marginTop: "10px", cursor: "pointer" }}
              />
            )}
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Guardian Requests</h1>

            <div className="flex flex-col">
              <div>
                {guardiansView ? (
                  <div>
                    <RecoveryGuardians />
                  </div>
                ) : (
                  <button
                    className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "#f6851b" }}
                    onClick={() => {
                      toggleGuardians(!guardiansView);
                    }}
                  >
                    Start Recovery
                  </button>
                )}
              </div>
              <div></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div className=" w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-flex-center overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Login with Recovery Account</h1>

            <div className="w-11/12 px-4 sm:px-6 lg:px-8 z-0 flex justify-center">
              <div className="p-7 flex flex-3 flex-col bg-background-secondary">
                {Buttons.map((button) => generateButton(button.loginProvider, button.adapter, button.label, button.backgroundColor, false))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Recovery;
