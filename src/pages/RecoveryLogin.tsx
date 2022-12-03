import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Steps from "../components/Steps";
import { useWeb3Auth } from "../services/web3auth";

function RecoveryLogin() {
  const { provider, recoveryAccounts, loginWithRecoveryAccount } = useWeb3Auth();
  const navigate = useNavigate();
  const [guardian1, setGuardian1] = useState<string>("");
  const [guardian2, setGuardian2] = useState<string>("");
  const [guardian3, setGuardian3] = useState<string>("");

  const account = (
    <svg
      className="mr-2 h-7 w-7 flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
  const details = (
    <svg
      className="mr-2 h-7 w-7 flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
      />
    </svg>
  );

  // if (!provider) navigate("/");

  const [step, setStep] = useState("recovery");
  const formDetailsRecovery = [];
  const loginMethods = [];

  recoveryAccounts.map((account) => {
    formDetailsRecovery.push({
      label: `Recovery Accounts (${account.typeOfLogin})`,
      input: account.address,
      readOnly: true,
    });
    loginMethods.push(account.typeOfLogin);
    return null;
  });

  const formDetailsGuardians = [
    {
      label: "Setup Type",
      input: "2/3 Guardians Construct Key",
      readOnly: true,
    },
    {
      label: "Guardian 1",
      input: guardian1 as string,
      placeholder: "Enter your Guardian's Email",
      readOnly: false,
      onChange: setGuardian1,
    },
    {
      label: "Guardian 2",
      input: guardian2 as string,
      placeholder: "Enter your Guardian's Email",
      readOnly: false,
      onChange: setGuardian2,
    },
    {
      label: "Guardian 3",
      input: guardian3 as string,
      placeholder: "Enter your Guardian's Email",
      readOnly: true,
      onChange: setGuardian3,
    },
  ];
  const StepData = [
    {
      stepName: "Setup Recovery Account",
      stepDetails: "Setup your recovery account to recover your account in case you lose access to your primary account.",
      image: account,
      active: step === "recovery",
    },
    {
      stepName: "Select Guardians",
      stepDetails: "Enter details of your guardians who will safeguard your account.",
      image: details,
      active: step === "guardians",
    },
  ];

  const generateButton = (loginProvider, adapter, label, backgroundColor, disabled) => {
    return (
      <button
        disabled={disabled}
        className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
        style={{ backgroundColor }}
        onClick={() => loginWithRecoveryAccount(loginProvider, adapter)}
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
    <main className="flex flex-col h-screen z-0 text-white">
      <div className="flex flex-1 overflow-hidden">
        <div className=" w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-flex-center overflow-scroll">
          <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Login with Recovery Account</h1>

          <div className="w-11/12 px-4 sm:px-6 lg:px-8 z-0 flex justify-center">
            <div className="p-7 flex flex-3 flex-col bg-background-secondary">
              {Buttons.map((button) => {
                if (loginMethods.includes(button.loginProvider))
                  return generateButton(button.loginProvider, button.adapter, button.label, "#e2e8f0", true);
                return generateButton(button.loginProvider, button.adapter, button.label, button.backgroundColor, false);
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RecoveryLogin;
