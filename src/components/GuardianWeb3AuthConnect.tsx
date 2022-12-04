import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";
import { useWeb3Auth } from "../services/web3auth";

const GuardianWeb3AuthConnect = () => {
  const { provider, login, logout } = useWeb3Auth();
  const navigate = useNavigate();
  const [requestId, setRequestId] = useState(null);

  const checkRequestId = () => {
    const url = new URL(window.location.href);
    const reqId = url.searchParams.get("uuid");
    setRequestId(reqId);
  };

  useEffect(() => {
    checkRequestId();
  }, []);

  const guardianLogin = async () => {
    await login();
    navigate(`/guardianRequests?uuid=${requestId}`);
  };
  return (
    <div
      className="flex flex-row rounded-full px-6 py-3 text-white justify-center align-center cursor-pointer"
      style={{ backgroundColor: "#599cb3" }}
      onClick={guardianLogin}
    >
      <img src={web3AuthLogoWhite} className="headerLogo" />
      Login as Guardian
    </div>
  );
};

export default GuardianWeb3AuthConnect;
