import { ChainId } from "@biconomy/core-types";
// import { Biconomy } from "@biconomy/mexa";
import SmartAccount from "@biconomy/smart-account";
import type { SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from "ethers";
import Web3 from "web3";

import { contractABI, contractAddress, contractByteCode } from "../config/contractDetails";
import { IWalletProvider } from "./walletProvider";

const ethProvider = (provider: SafeEventEmitterProvider | null, uiConsole: (...args: unknown[]) => void): IWalletProvider => {
  const options = {
    activeNetworkId: ChainId.POLYGON_MUMBAI,
    supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
    // Network Config.
    // Link Paymaster / DappAPIKey for the chains you'd want to support Gasless transactions on
    networkConfig: [
      {
        chainId: ChainId.POLYGON_MUMBAI,
        dappAPIKey: "653d0da3-ae5e-4beb-bde5-689fb7532312", // Get one from Paymaster Dashboard
        // customPaymasterAPI: <IPaymaster Instance of your own Paymaster>
      },
    ],
  };

  const getAddress = async (): Promise<any> => {
    try {
      const web3 = new Web3(provider as any);
      const address = (await web3.eth.getAccounts())[0];
      return address;
    } catch (error) {
      console.log(error);
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
      console.log(error);
      return error;
    }
  };

  const sendTransaction = async (): Promise<any> => {
    try {
      const web3 = new Web3(provider as any);

      const walletProvider = new ethers.providers.Web3Provider(provider);
      const wallet = new SmartAccount(walletProvider, options as any);
      console.log(wallet);
      const smartAccount = await wallet.init();
      console.log("smartAccount", smartAccount);
      const { address } = smartAccount;
      console.log("address", address);

      // const tx1 = {
      //   to: "0x3888b4606f9f12ee2e92f04bb0398172bb91765d",
      //   data: "0x3d7403a30000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001e547275655265735120697320747275656c79204761736c657373206e6f770000",
      //   // value can also be added for example ethers.utils.parseEther("1")
      // };

      // const txResponse = await smartAccount.sendGasLessTransaction({ transaction: tx1 });

      // const fromAddress = (await web3.eth.getAccounts())[0];

      // const destination = "0x7aFac68875d2841dc16F1730Fba43974060b907A";

      // Submit transaction to the blockchain and wait for it to be mined
      // const receipt = await web3.eth.sendTransaction({
      //   from: fromAddress,
      //   to: destination,
      //   value: web3.utils.toWei("0.01"),
      //   maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
      //   maxFeePerGas: "6000000000000", // Max fee per gas
      // });
      // return receipt;
    } catch (error) {
      uiConsole(error);
      return error;
    }
  };

  const deployContract = async () => {
    const web3 = new Web3(provider as any);
    const contract = new web3.eth.Contract(JSON.parse(contractABI));
    const address = (await web3.eth.getAccounts())[0];

    // Deploy contract with "Hello World!" in the constructor and wait to finish
    const contractInstance = await contract
      .deploy({
        data: contractByteCode,
        arguments: ["Hello World!"],
      })
      .send({
        from: address,
      });

    return contractInstance;
  };

  const readContract = async () => {
    const web3 = new Web3(provider as any);
    const contract = new web3.eth.Contract(JSON.parse(contractABI), contractAddress);

    // Deploy contract with "Hello World!" in the constructor and wait to finish
    const message = await contract.methods.message().call();
    return message;
  };

  const writeContract = async () => {
    const walletProvider = new ethers.providers.Web3Provider(provider);
    // console.log(walletProvider);
    const wallet = new SmartAccount(walletProvider, options as any);
    // console.log(wallet);
    const smartAccount = await wallet.init();
    // console.log("smartAccount", smartAccount);
    const { address } = smartAccount;
    // console.log("address", address);

    const web3 = new Web3(provider as any);
    const data = web3.eth.abi.encodeFunctionCall(
      {
        name: "update",
        type: "function",
        inputs: [
          {
            type: "string",
            name: "message",
          },
        ],
      },
      ["Gasless truely"]
    );

    const tx1 = {
      to: "0x3888b4606f9f12ee2e92f04bb0398172bb91765d",
      data: "0x3d7403a30000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001e547275655265735120697320747275656c79204761736c657373206e6f770000",
      // value can also be added for example ethers.utils.parseEther("1")
    };

    const tx2 = {
      to: "0x3888b4606f9f12ee2e92f04bb0398172bb91765d",
      data,
    };

    const txResponse = await smartAccount.sendGasLessTransaction({ transaction: tx2 });
    return txResponse;
    // const web3 = new Web3(provider as any);
    // //
    // try {
    //   const address = await web3.eth.getAccounts();
    //   console.log(address);
    //   const contract = new web3.eth.Contract(JSON.parse(contractABI), contractAddress);

    //   // // Deploy contract with "Hello World!" in the constructor and wait to finish
    //   const receipt = await contract.methods.update("TrueResQ is Gasless now").send({
    //     from: address[0],
    //   });

    //   return receipt;
    // } catch (error) {
    //   console.error(error.message);
    // }
  };

  return {
    getAddress,
    getBalance,
    sendTransaction,
    deployContract,
    readContract,
    writeContract,
  };
};

export default ethProvider;
