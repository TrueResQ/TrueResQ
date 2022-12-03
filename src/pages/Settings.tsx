// @ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import { useWeb3Auth } from "../services/web3auth";

function Withdrawal() {
  const { provider, address, balance } = useWeb3Auth();
  const navigate = useNavigate();

  if (!provider) navigate("/");

  const [tab, setTab] = useState("recovery");

  const formDetailsRecovery = [
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
  ];

  const formDetailsGaurdians = [
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
  ];
  const TabData = [
    {
      tabName: "Setup Recovery Account",
      onClick: () => setTab("recovery"),
      active: tab === "recovery",
    },
    {
      tabName: "Select Gaurdians",
      onClick: () => setTab("guardians"),
      active: tab === "guardians",
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
          <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Settings</h1>
          <Tabs tabData={TabData} />
          {tab === "recovery" ? <Form formDetails={formDetailsRecovery}></Form> : <Form formDetails={formDetailsGaurdians}></Form>}
        </div>
      </div>
    </main>
  );
}

export default Withdrawal;
