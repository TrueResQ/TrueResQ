import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IWeb3AuthContext {
  web3Auth: Web3Auth | null;
  provider: IWalletProvider | null;
  isLoading: boolean;
  user: any;
  address: any;
  balance: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  web3Auth: null,
  provider: null,
  isLoading: false,
  user: null,
  address: null,
  balance: null,
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => {},
});

export function useWeb3Auth(): IWeb3AuthContext {
  return useContext(Web3AuthContext);
}

interface IWeb3AuthProps {
  children?: ReactNode;
}

export const Web3AuthProvider = ({ children }: IWeb3AuthProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IWalletProvider | null>(null);
  const [address, setAddress] = useState<IWalletProvider | null>(null);
  const [balance, setBalance] = useState<IWalletProvider | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uiConsole = (...args: unknown[]): void => {
    const el = document.querySelector("#console");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const setWalletProvider = useCallback(async (web3authProvider: SafeEventEmitterProvider | null) => {
    const walletProvider = getWalletProvider(web3authProvider, uiConsole);
    setProvider(walletProvider);
    setAddress(await walletProvider.getAddress());
    setBalance(await walletProvider.getBalance());
  }, []);

  useEffect(() => {
    const subscribeAuthEvents = (web3auth: Web3Auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data: any) => {
        uiConsole("Yeah!, you are successfully logged in", data);
        setWalletProvider(web3auth.provider!);
        const userDetails = await web3auth.getUserInfo();
        setUser(userDetails);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          public_address: address,
          verifier_id: user.verifierId,
          verifier: user.verifier,
        });
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          mode: "cors" as RequestMode,
          redirect: "follow" as RequestRedirect,
        };

        fetch("http://localhost:2020/user", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        uiConsole("connecting");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        uiConsole("disconnected");
        setUser(null);
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        uiConsole("some error or user has cancelled login request", error);
      });
    };

    async function init() {
      try {
        setIsLoading(true);
        const clientId = "BJRZ6qdDTbj6Vd5YXvV994TYCqY42-PxldCetmvGTUdoq6pkCqdpuC1DIehz76zuYdaq1RJkXGHuDraHRhCQHvA";
        const web3AuthInstance = new Web3Auth({
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881", // hex of 80001, polygon testnet
            rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
            // Avoid using public rpcTarget in production.
            // Use services like Infura, Quicknode etc
            displayName: "Polygon Mainnet",
            blockExplorer: "https://mumbai.polygonscan.com/",
            ticker: "MATIC",
            tickerName: "Matic",
          },
          // get your client id from https://dashboard.web3auth.io
          clientId,
        });
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();
      } catch (error) {
        uiConsole(error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [setWalletProvider]);

  const login = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    console.log("web3auth connecting");
    const localProvider = await web3Auth.connect();
    console.log("web3auth connected");
    setWalletProvider(localProvider);
  };

  const logout = async () => {
    uiConsole("Logging out");
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3Auth.getUserInfo();
    uiConsole(user);
  };

  const getAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    await provider.getAddress();
  };

  const readContract = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await provider.readContract();
  };

  const deployContract = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await provider.getBalance();
  };

  const writeContract = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await provider.writeContract();
  };

  const getBalance = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await provider.getBalance();
  };

  const contextProvider = {
    web3Auth,
    provider,
    user,
    isLoading,
    address,
    balance,
    login,
    logout,
    getUserInfo,
    getAddress,
    getBalance,
    deployContract,
    readContract,
    writeContract,
  };
  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
