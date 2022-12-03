import type { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";

import { contractABI, contractAddress, contractByteCode } from "../config/contractDetails";
import { IWalletProvider } from "./walletProvider";

const ethProvider = (provider: SafeEventEmitterProvider | null, uiConsole: (...args: unknown[]) => void): IWalletProvider => {
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
      const fromAddress = (await web3.eth.getAccounts())[0];

      const destination = "0x7aFac68875d2841dc16F1730Fba43974060b907A";
      // const amount = web3.utils.toWei(); // Convert 1 ether to wei

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        value: web3.utils.toWei("0.01"),
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });
      return receipt;
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
    const web3 = new Web3(provider as any);
    const contract = new web3.eth.Contract(JSON.parse(contractABI), contractAddress);
    const address = (await web3.eth.getAccounts())[0];

    // Deploy contract with "Hello World!" in the constructor and wait to finish
    const receipt = await contract.methods.update("NEW_MESSAGE").send({
      from: address,
      maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
      maxFeePerGas: "6000000000000", // Max fee per gas
    });

    return receipt;
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
