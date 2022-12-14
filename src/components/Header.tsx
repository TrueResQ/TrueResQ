import Hamburger from "hamburger-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import ConnectWeb3AuthButton from "./ConnectWeb3AuthButton";
import Drawer from "./Drawer";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  function goToHome() {
    navigate("/");
  }

  return (
    <header className="sticky max-w-screen z-10 bg-background">
      <div className="px-4 py-4 mx-auto sm:py-2 sm:px-6 md:px-8">
        <div className="justify-between items-center flex">
          <div className="flex flex-row justify-center py-3" onClick={() => goToHome()}>
            <img src={logo} style={{ height: "1.75rem", paddingLeft: "0.5rem" }} />
          </div>
          <div className="flex-col flex-row mt-0 items-center lg:flex hidden">
            <ConnectWeb3AuthButton />
          </div>
          <div className="flex-col flex-row mt-0 items-center flex lg:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} size={25} direction="right" />
          </div>
        </div>
      </div>
      <div className={`ease-in-out duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        <Drawer isOpen={isOpen} setOpen={setOpen} />
      </div>
    </header>
  );
};

export default Header;
