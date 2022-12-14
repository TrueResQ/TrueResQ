import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Steps from "../components/Steps";
import { useWeb3Auth } from "../services/web3auth";

function Settings() {
  const { provider, recoveryAccounts, addRecoveryAccount, address, user } = useWeb3Auth();
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
      stroke-width="2">
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
      stroke-width="2">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
      />
    </svg>
  );

  if (!provider) navigate("/");

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
        onClick={() => addRecoveryAccount(loginProvider, adapter)}>
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
    <main className="flex flex-col h-screen z-0 text-white bg-background-secondary">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className=" w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-flex-start overflow-hidden">
          <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Settings</h1>
          <Steps stepData={StepData} />

          {step === "recovery" ? (
            <div className="w-11/12 text-center justify-center items-center space-y-4  mt-6">
              <div className="px-4 sm:px-6 lg:px-8 z-0 flex rounded">
                <div className="p-8 flex flex-3 flex-col overflow-hidden bg-background rounded-l-lg">
                  {Buttons.map((button) => {
                    if (loginMethods.includes(button.loginProvider))
                      return generateButton(button.loginProvider, button.adapter, button.label, "#303030", true);
                    return generateButton(button.loginProvider, button.adapter, button.label, button.backgroundColor, false);
                  })}
                </div>
                <div className="p-8 flex flex-1 flex-col bg-background overflow-hidden bg-white rounded-r-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-sm rounded">
                    <thead className="bg-primary rounded">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-white rounded-l">Account Type</th>
                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-white">Account</th>
                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-white rounded-r">Address</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recoveryAccounts.map((account) => {
                        return (
                          <tr>
                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-300 rounded-l">{account.typeOfLogin}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-100">{account.verifierId}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-100 rounded-r">{account.address}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <button
                disabled={recoveryAccounts.length === 0}
                className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={recoveryAccounts.length === 0 ? { backgroundColor: "#303030" } : { backgroundColor: "#599cb3" }}
                onClick={() => setStep("guardians")}>
                Proceed to add Guardians
              </button>
            </div>
          ) : (
            <Form formDetails={formDetailsGuardians}>
              <button
                disabled={guardian1 === "" || guardian2 === "" || guardian3 === ""}
                className="mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={guardian1 === "" || guardian2 === "" || guardian3 === "" ? { backgroundColor: "#303030" } : { backgroundColor: "#599cb3" }}
                onClick={async () => {
                  var recovery_addresses = "";
                  for (let index = 0; index < recoveryAccounts.length; index++) {
                    recovery_addresses += recoveryAccounts[index]["address"] + ",";
                  }
                  var myHeaders = new Headers();
                  myHeaders.append("Content-Type", "application/json");
                  var raw = JSON.stringify({
                    verifier_id: user.verifierId,
                    verifier: user.verifier,
                    recovery_addresses: recovery_addresses.substring(0, recovery_addresses.length - 2),
                    guardians: guardian1 + "," + guardian2 + "," + guardian3,
                    public_address: address,
                  });

                  var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow" as RequestRedirect,
                  };

                  fetch("http://localhost:2020/user/set_recovery", requestOptions)
                    .then((response) => response.text())
                    .then((result) => console.log(result))
                    .catch((error) => console.log("error", error));

                  var raw = JSON.stringify({
                    from_email: user.verifierId,
                    public_address: address,
                  });

                  var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow" as RequestRedirect,
                  };

                  fetch("http://localhost:2020/email", requestOptions)
                    .then((response) => response.text())
                    .then((result) => console.log(result))
                    .catch((error) => console.log("error", error));
                }}>
                Finish Setting up Recovery
              </button>
            </Form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Settings;
