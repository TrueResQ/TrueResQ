import { SafeEventEmitterProvider } from "@web3auth/base";

import starkexProvider from "./ethProvider";

export interface IWalletProvider {
  getAddress: () => Promise<any>;
  getBalance: () => Promise<any>;
}

export const getWalletProvider = (provider: SafeEventEmitterProvider | null, uiConsole: any): IWalletProvider => {
  return starkexProvider(provider, uiConsole);
};
