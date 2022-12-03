// @ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
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
const guardianRequests = [
  {
    email: "himanshu@tor.us",
    address: "0x8b1f49491477e0fb46a29fef53f1ea320d13c349",
    status: "pending", // pending, approved, rejected
    requestId: "1234567890",
  },
];
function Recovery() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isExistingRecovery, setExistingRecovery] = useState(false);
  const [guardiansView, toggleGuardians] = useState(false);

  const [tab, setTab] = useState("recovery");

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
          <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Guardian Requests</h1>
          {guardiansView && (
            <FaArrowLeft
              onClick={() => toggleGuardians(!guardiansView)}
              className="flex-start"
              style={{ marginRight: "auto", marginLeft: "10px", cursor: "pointer" }}
            />
          )}

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
    </main>
  );
}

export default Recovery;
