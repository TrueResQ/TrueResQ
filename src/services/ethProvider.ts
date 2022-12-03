import type { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";

import { IWalletProvider } from "./walletProvider";

const ethProvider = (provider: SafeEventEmitterProvider | null, uiConsole: (...args: unknown[]) => void): IWalletProvider => {
  const getAddress = async (): Promise<any> => {
    try {
      const web3 = new Web3(provider as any);
      const address = (await web3.eth.getAccounts())[0];
      return address;
    } catch (error) {
      uiConsole(error);
      return error;
    }
  };

  const getBalance = async (): Promise<any> => {
    try {
      const web3 = new Web3(provider as any);
      const address = (await web3.eth.getAccounts())[0];
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address) // Balance is in wei
      );
      return balance;
    } catch (error) {
      uiConsole(error);
      return error;
    }
  };
  return {
    getAddress,
    getBalance,
  };
};

export default ethProvider;
