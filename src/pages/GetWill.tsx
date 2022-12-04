// @ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Form from "../components/Form";
import Table from "../components/GuardianRequestsTable";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import { useWeb3Auth } from "../services/web3auth";

function GetWill() {
  const { provider, address, balance, recoveryAccounts, addRecoveryAccount } = useWeb3Auth();
  const [requestId, setRequestId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modal, showModal] = useState(false);

  const getWills = [
    {
      email: "himanshu@tor.us",
      address: "0x8b1f49491477e0fb46a29fef53f1ea320d13c349",
      status: "pending", // pending, approved, rejected
      requestId: "1234567890",
      onClick: () => showModal(true),
    },
  ];

  const checkRequestId = () => {
    const url = new URL(window.location.href);
    const reqId = url.searchParams.get("uuid");
    setRequestId(reqId);
  };
  useEffect(() => {
    // if (!provider) navigate("/");
    checkRequestId();
  }, []);

  const location = useLocation();
  useEffect(() => {
    console.log("url changed");
    checkRequestId();
  }, [location]);

  if (!provider) navigate("/");

  const formDetailsRecovery = [];
  const loginMethods = [];

  recoveryAccounts.map((account, index) => {
    formDetailsRecovery.push({
      label: `Recovery Accounts ${index + 1}`,
      input: JSON.stringify(account),
      readOnly: true,
    });
    loginMethods.push(account.typeOfLogin);
    return null;
  });

  return (
    <main className="flex flex-col h-screen z-0 text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className=" w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-flex-start overflow-scroll">
          <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Guardian Requests</h1>
          {requestId ? (
            <div className="w-11/12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-flex-center">
              <div
                style={{ marginRight: "auto", marginLeft: "20px", cursor: "pointer" }}
                onClick={() => {
                  navigate("");
                }}
              >
                <FaArrowLeft />
              </div>
              <div>You are invited to be the guardian of himanshu</div>
              <div className="flex flex-row pd-100">
                <div>
                  <button
                    className="mt-1 mb-0 mr-10 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "green", cursor: "pointer" }}
                    onClick={() => {}}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Table requests={guardianRequests} />
          )}
        </div>
      </div>
    </main>
  );
}

export default GetWill;
