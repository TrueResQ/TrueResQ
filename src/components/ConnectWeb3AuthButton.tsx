import { useWeb3Auth } from "../services/web3auth";

const ConnectWeb3AuthButton = () => {
  const { provider, login, logout } = useWeb3Auth();

  if (provider) {
    return (
      <div
        className="flex flex-row rounded-full px-6 py-3 text-white justify-center align-center cursor-pointer"
        style={{ backgroundColor: "#599cb3" }}
        onClick={logout}
      >
        <img className="headerLogo" />
        Disconnect
      </div>
    );
  }
  return (
    <div
      className="flex flex-row rounded-full px-6 py-3 text-white justify-center align-center cursor-pointer"
      style={{ backgroundColor: "#599cb3" }}
      onClick={login}
    >
      <img className="headerLogo" />
      Get Started
    </div>
  );
};

export default ConnectWeb3AuthButton;
