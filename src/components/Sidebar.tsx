import { useLocation, useNavigate } from "react-router-dom";

import { useWeb3Auth } from "../services/web3auth";

const Sidebar = () => {
  const { provider, user, address } = useWeb3Auth();

  const navigate = useNavigate();

  function goToHome() {
    navigate("/");
  }
  function goToSettings() {
    navigate("/settings");
  }
  function goToGuardianRequests() {
    navigate("/guardianRequests");
  }

  function setWill() {
    navigate("/setwill");
  }
  const location = useLocation();
  function linktoGo(label: string, path: any) {
    return (
      <div
        onClick={() => path()}
        className="flex items-center px-4 py-2 mb-2 text-gray-300 rounded-lg hover:bg-background-secondary hover:text-primary cursor-pointer"
      >
        <span className="text-sm font-normal">{label}</span>
      </div>
    );
  }
  function activePage(label: string) {
    return (
      <div className="flex items-center px-4 py-2 mb-2 rounded-lg bg-background-secondary text-primary  cursor-pointer">
        <span className="text-sm font-bold">{label}</span>
      </div>
    );
  }
  function userProfile() {
    if (provider) {
      try {
        return (
          <div className="sticky px-4 inset-x-0 bottom-0">
            <div className="flex items-center justify-flex-start py-4 shrink-0 overflow-hidden">
              <img className="object-cover w-10 h-10 rounded-full" src={user.profileImage} referrerPolicy="no-referrer" />

              <div className="ml-1.5">
                <p className="text-xs text-gray-200">
                  <strong className="block font-medium">{user.name as string}</strong>
                  <span>{address as string}</span>
                </p>
              </div>
            </div>
          </div>
        );
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }

  return (
    <div className="flex flex-col justify-between h-screen bg-background w-64 p-5 lg:flex hidden">
      <div className="py-3">
        <strong className="px-4 block p-1 text-xs font-medium text-gray-200 uppercase">MENU</strong>
        <nav className="flex flex-col mt-6">
          {location.pathname === "/" ? activePage("Account Details") : linktoGo("Account Details", goToHome)}
          {location.pathname === "/settings" ? activePage("Settings") : linktoGo("Settings", goToSettings)}
          {location.pathname === "/guardianRequests" ? activePage("Guardian Requests") : linktoGo("Recovery Requests", goToGuardianRequests)}
          {location.pathname === "/setwill" ? activePage("Set Your Will") : linktoGo("Set Your Will", setWill)}
        </nav>
      </div>
      {userProfile()}
    </div>
  );
};
export default Sidebar;
