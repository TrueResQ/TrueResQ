// @ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import { useWeb3Auth } from "../services/web3auth";

function Settings() {
  const { provider, address, balance, recoveryAccounts, addRecoveryAccount } = useWeb3Auth();
  const navigate = useNavigate();

  if (!provider) navigate("/");

  const [tab, setTab] = useState("recovery");
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

  const generateButton = (loginProvider, adapter, label, backgroundColor) => {
    return (
      <button
        className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
        style={{ backgroundColor }}
        onClick={() => addRecoveryAccount(loginProvider, adapter)}
      >
        {label}
      </button>
    );
  };

  const Buttons = [
    { loginProvider: "google", adapter: "openlogin", label: "Google", backgroundColor: "#dd4b39" },
    { loginProvider: "facebook", adapter: "openlogin", label: "Facebook", backgroundColor: "#3b5998" },
    { loginProvider: "twitter", adapter: "openlogin", label: "Twitter", backgroundColor: "#00acee" },
    { loginProvider: "discord", adapter: "openlogin", label: "Discord", backgroundColor: "#7289da" },
    { loginProvider: "metamask", adapter: "metamask", label: "Metamask", backgroundColor: "#f6851b" },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
          <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Settings</h1>
          <Tabs tabData={TabData} />

          {tab === "recovery" ? (
            <Form formDetails={formDetailsRecovery}>
              <div className=" w-full flex flex-1 justify-between ">
                {Buttons.map((button) => {
                  if (loginMethods.includes(button.loginProvider)) return null;
                  return generateButton(button.loginProvider, button.adapter, button.label, button.backgroundColor);
                })}
              </div>
            </Form>
          ) : (
            <Form formDetails={formDetailsGaurdians}></Form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Settings;
