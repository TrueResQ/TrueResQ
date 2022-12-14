import { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import type { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";

import { abi, byteCode } from "../contracts/walletAbi";
import { setUserData } from "../utils/helpers";
class WalletContract {
  private contract: Contract;
  private web3: Web3;
  // 5. Create deploy function
  deploy = async (provider: SafeEventEmitterProvider, walletAddress: string) => {
     this.web3 = new Web3(provider as any);

    // 6. Create contract instance
    const walletContract = new this.web3.eth.Contract(abi as AbiItem[]);
    const address = (await this.web3.eth.getAccounts())[0];

    // Deploy contract with "Hello World!" in the constructor and wait to finish
    const contractInstance = await walletContract
      .deploy({
        data: byteCode.object,
        arguments: [address, address],
      })
      .send({
        from: address,
      })
      .on("error", function (error) {
        console.log("error while deploying", error);
      })
      .on("transactionHash", function (transactionHash) {
        console.log("transaction hash", transactionHash);
      })
      .on("receipt", function (receipt) {
        console.log(receipt.contractAddress); // contains the new contract address
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("receipt", receipt);
      })
      .then(function (newContractInstance) {
        console.log(newContractInstance.options.address); // instance with the new contract address
        const data = {
          address: newContractInstance.options.address,
        };
        setUserData(walletAddress, data);
        return newContractInstance;
      });
    return contractInstance;
  };

  init = async (provider: SafeEventEmitterProvider, walletAddress: string, address?: string) => {
    const web3 = new Web3(provider as any);
    if (address) {
      this.contract = new web3.eth.Contract(abi as AbiItem[], address);
    } else {
      // deploy smart contract
      this.contract = await this.deploy(provider, walletAddress);
    }
  };

  getBalance = async (): Promise<string> => {
    const balanceInWei = this.contract.methods.getBalance().call();
    return Web3.utils.fromWei(balanceInWei, "ether");
  };

  getOwner = async (): Promise<string> => {
    return this.contract.methods.owner().call();
  };

  getGuardians = async (): Promise<string[]> => {
    return this.contract.methods.getGuardians().call();
  };

  getRecoveryAccounts = async (): Promise<string[]> => {
    return this.contract.methods.getRecoveryAccounts().call();
  };

  setupSocialRecovery = async (recoveryAccounts: string[], guardians: string[]): Promise<void> => {
    return this.contract.methods.setupSocialRecovery(recoveryAccounts, guardians).send();
  };

  getWillAccount = async (): Promise<string> => {
    return this.contract.methods.willAccount().call();
  };

  updateWillAccount = async (willAccount: string): Promise<void> => {
    const address = (await this.web3.eth.getAccounts())[0];

    return this.contract.methods.updateWillAccount(willAccount).send({ from: address });
  };

  sendEther = async (to: string, amount: string): Promise<void> => {
    // call a payable function in solidity
    return this.contract.methods.sendEth(to).send({ value: Web3.utils.toWei(amount, "ether") });
  };

  updatePrimaryAccount = async (signature: string, newAddress: string, signer: string): Promise<void> => {
    // todo: convert sig to bytes;
    return this.contract.methods.updatePrimaryAccount(signature, newAddress, signer).send();
  };
}

export default WalletContract;
