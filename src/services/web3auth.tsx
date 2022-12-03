import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3AuthCore } from "@web3auth/core";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import Web3 from "web3";

import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IWeb3AuthContext {
  web3Auth: Web3Auth | null;
  provider: IWalletProvider | null;
  isLoading: boolean;
  user: any;
  address: any;
  balance: any;
  recoveryAccounts: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAddress: () => Promise<any>;
  getBalance: () => Promise<any>;
  deployContract: () => Promise<any>;
  readContract: () => Promise<any>;
  writeContract: () => Promise<any>;
  addRecoveryAccount: (loginProvider: string, adapter: string) => Promise<any>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  web3Auth: null,
  provider: null,
  isLoading: false,
  user: null,
  address: null,
  balance: null,
  recoveryAccounts: null,
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => {},
  getAddress: async () => {},
  getBalance: async () => {},
  deployContract: async () => {},
  readContract: async () => {},
  writeContract: async () => {},
  addRecoveryAccount: async () => {},
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
  const [recoveryAccounts, setRecoveryAccounts] = useState<any>([]);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const clientId = "BJRZ6qdDTbj6Vd5YXvV994TYCqY42-PxldCetmvGTUdoq6pkCqdpuC1DIehz76zuYdaq1RJkXGHuDraHRhCQHvA";

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
        console.log("Yeah!, you are successfully logged in", data);
        setWalletProvider(web3auth.provider!);
        const userDetails = await web3auth.getUserInfo();
        setUser(userDetails);
        // getStarkKey();
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
        setUser(null);
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.log("some error or user has cancelled login request", error);
      });
    };

    async function init() {
      try {
        setIsLoading(true);
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
          storageKey: "local",
        });
        subscribeAuthEvents(web3AuthInstance);
        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            network: "cyan",
          },
        });
        web3AuthInstance.configureAdapter(openloginAdapter);
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [setWalletProvider]);

  const login = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      console.log("web3auth not initialized yet");
      return;
    }
    console.log("web3auth connecting");
    const localProvider = await web3Auth.connect();
    console.log("web3auth connected");
    setWalletProvider(localProvider);
  };

  const logout = async () => {
    console.log("Logging out");
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      console.log("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3Auth.getUserInfo();
    console.log(user);
  };

  const getAddress = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    await provider.getAddress();
  };

  const readContract = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await provider.readContract();
  };

  const deployContract = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await provider.deployContract();
  };

  const writeContract = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await provider.writeContract();
  };

  const getBalance = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await provider.getBalance();
  };

  const addRecoveryAccount = async (loginProvider, adapter) => {
    const web3AuthInstance = new Web3AuthCore({
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
      storageKey: "session",
    });
    const r = (Math.random() + 1).toString(36).substring(7);
    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        network: "cyan",
        _sessionNamespace: r,
        uxMode: "popup",
      },
    });
    web3AuthInstance.configureAdapter(openloginAdapter);
    const metamaskAdapter = new MetamaskAdapter({ clientId });
    web3AuthInstance.configureAdapter(metamaskAdapter);
    await web3AuthInstance.init();
    let newProvider = null;
    if (adapter === "openlogin") {
      newProvider = await web3AuthInstance.connectTo(adapter, {
        loginProvider,
      });
    } else {
      newProvider = await web3AuthInstance.connectTo(adapter);
    }
    const web3 = new Web3(newProvider as any);
    const address = (await web3.eth.getAccounts())[0];
    const recoveryDetails = await web3AuthInstance.getUserInfo();
    let typeOfLogin = null;
    if (recoveryDetails.typeOfLogin) {
      typeOfLogin = recoveryDetails.typeOfLogin;
    } else {
      typeOfLogin = "metamask";
    }
    let verifierId = null;
    if (recoveryDetails.verifierId) {
      verifierId = recoveryDetails.verifierId;
    } else {
      verifierId = "metamask";
    }
    setRecoveryAccounts([...recoveryAccounts, { address, typeOfLogin, verifierId }]);
    await web3AuthInstance.logout();
    return address;
  };

  const contextProvider = {
    web3Auth,
    provider,
    user,
    isLoading,
    address,
    balance,
    recoveryAccounts,
    login,
    logout,
    getUserInfo,
    getAddress,
    getBalance,
    deployContract,
    readContract,
    writeContract,
    addRecoveryAccount,
  };
  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
