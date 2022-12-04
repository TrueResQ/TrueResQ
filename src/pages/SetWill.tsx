// @ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import sss from "shamirs-secret-sharing";
import Swal from 'sweetalert2'
import Web3 from "web3";

import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import Willtable from "../components/WillGuardiansTable";
import WalletContract from "../services/contract";
import { getTimeLockedShares } from "../services/sss";
import { decryptMulti } from "../services/timelock/decrypt";
import { useWeb3Auth } from "../services/web3auth";
import { getUserData, setUserData } from "../utils/helpers";
const guardianRequests = [
  {
    email: "himanshu@tor.us",
    address: "0x8b1f49491477e0fb46a29fef53f1ea320d13c349",
  },
  {
    email: "shahbaz@tor.us",
    address: "0x6b1f494914bcjnfb46a29fef53f1ea320d13c346",
  },
  {
    email: "yash@tor.us",
    address: "0x3b1f494914bcjnfty6a29fef53f1ea320d13c343",
  },
];

const willGuardianRequests = {
  guardians: [
    {
      email: "himanshu@tor.us",
      address: "0x8b1f49491477e0fb46a29fef53f1ea320d13c349",
    },
    {
      email: "shahbaz@tor.us",
      address: "0x6b1f494914bcjnfb46a29fef53f1ea320d13c346",
    },
    {
      email: "yash@tor.us",
      address: "0x3b1f494914bcjnfty6a29fef53f1ea320d13c343",
    },
  ],
  timeout: "2",
};
function SetWill() {
  const { web3Auth, provider, address, balance, recoveryAccounts, addRecoveryAccount } = useWeb3Auth();
  const [requestId, setRequestId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const [guardian1, setGuardian1] = useState<string>("");
  const [guardian2, setGuardian2] = useState<string>("");
  const [guardian3, setGuardian3] = useState<string>("");
  const [willTime, setWillTime] = useState<string>("");
  const [userData, _setUserData] = useState<Record<string, any>>({});
  const checkRequestId = () => {
    const url = new URL(window.location.href);
    const reqId = url.searchParams.get("requestId");
    setRequestId(reqId);
  };

  useEffect(() => {
    async function init() {
      const userData = getUserData(address);
      _setUserData(userData);
    }
    init();
  }, []);
  useEffect(() => {
    // if (!provider) navigate("/");
    checkRequestId();
  }, []);

  const location = useLocation();
  useEffect(() => {
    console.log("url changed");
    checkRequestId();
  }, [location]);

  const formDetailsRecovery = [];
  const loginMethods = [];

  const formDetailsGuardians = [
    {
      label: "Setup Type",
      input: "2/3 Guardians Executes will after will time expires",
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
    {
      label: "Will Timeout in seconds",
      input: willTime as string,
      placeholder: "Will Timeout in seconds",
      readOnly: true,
      onChange: setWillTime,
    },
  ];
  return (
    <main className="flex flex-col h-screen z-0 text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className=" w-full h-full flex flex-1 flex-col bg-background-secondary items-center justify-flex-start overflow-scroll">
          <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Will Guardians</h1>
          {/* {userData?.myWillCustodians?.length > 0 ? ( */}
            <div>
              {/* <Willtable requests={willGuardianRequests} /> */}
             
            </div>
          {/* ) : ( */}
            <Form formDetails={formDetailsGuardians}>
              <button
                // disabled={guardian1 === "" || guardian2 === "" || guardian3 === ""}
                className="mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={guardian1 === "" || guardian2 === "" || guardian3 === "" ? { backgroundColor: "#303030" } : { backgroundColor: "#599cb3" }}
                onClick={async () => {
                   try {
                    const [shares, key] = await getTimeLockedShares(Date.now() + (parseInt(willTime,10) * 100));
                    console.log(guardian1, guardian2, guardian3, willTime, shares, "guardians");
  
                    const willGuardians = [];
                    shares.forEach((share, index) => {
                      willGuardians.push({
                        email: guardian1,
                        address: guardian1,
                        encryptedText: share.ciphertext,
                      });
                    });
                    const web3 = new Web3(web3Auth.provider as any);
                    const willAccount = web3.eth.accounts.privateKeyToAccount(Buffer.from(key).toString("hex"), true);
                    console.log("willGuardians", willGuardians);
                    setUserData(address, { myWillCustodians: willGuardians });
                    setLoading(true)
                    const wallet = new WalletContract();
                    await wallet.init(web3Auth.provider, userData.address);
                    await wallet.updateWillAccount(willAccount.address);
                    Swal.fire({
                      title: `Success: ${willAccount.address}`,
                      text: 'Key '+Buffer.from(key).toString("hex"),
                      icon: 'success',
                      confirmButtonText: 'Ok'
                    })
                   } catch (error) {
                    console.log("error", error);
                    Swal.fire({
                      title: 'Error!',
                      text: 'Error while setting up will',
                      icon: 'error',
                      confirmButtonText: 'Ok'
                    })
                   } finally {
                    setLoading(false)
                   }
                }}
              >
                { loading ? "Loading....." : "Finish Setting up will"}
              </button>

              <button
                // disabled={guardian1 === "" || guardian2 === "" || guardian3 === ""}
                className="mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={guardian1 === "" || guardian2 === "" || guardian3 === "" ? { backgroundColor: "#303030" } : { backgroundColor: "#599cb3" }}
                onClick={async () => {
                  try {
                  const userData = getUserData(address);
                  console.log("myWillCustodians", userData.myWillCustodians);
                  const shares = userData.myWillCustodians.map((encShare) => {
                    return decryptMulti(encShare.encryptedText);
                  });
                  const resolvedShares = await Promise.all(shares);
                  console.log("shares", resolvedShares);
                  const finalShares = resolvedShares.map((share) => {
                    return Buffer.from(share.value, "hex");
                  });
                  const recovered = sss.combine(finalShares);
                  // const wallet = new WalletContract();
                  // await wallet.init(web3Auth.provider, userData.address);
                  // await wallet.updateWillAccount(recovered.toString("hex"));
                  const web3 = new Web3(web3Auth.provider as any);
                  const willAccount = web3.eth.accounts.privateKeyToAccount(Buffer.from(recovered).toString("hex"), true);
                  Swal.fire({
                    title: `Success: ${willAccount.address}`,
                    text: 'Key '+Buffer.from(recovered).toString("hex"),
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  })
                }
                catch(e) {
                  console.log("error", e);
                  Swal.fire({
                    title: 'Error!',
                    text: 'Time lock not complete',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  })
                } finally{
                  setLoading(false)

                }
                }}
              >
                                { loading ? "Loading....." : "Execute Will (Nominee)"}

                
              </button>
            </Form>
          {/* )} */}
        </div>
      </div>
    </main>
  );
}

export default SetWill;
