// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract Wallet is Ownable {

    address willAddress;

    address primaryWallet;

    struct RecoveryAccount {
        address recoveryAddress;
        bool isActive;
    }

    struct GuardianAccount {
        address guardianAddress;
        bool isActive;
    }

    uint accountUpdateThreshold = 2;

    uint totalGuardians;
    

    uint totalRecoveryAccounts;

    address[] guardianAddresses;

    address[] recoveryAddresses;

    // recovery address to account details 
    mapping(address => RecoveryAccount) recoveryAccountMapping;

    mapping(address => GuardianAccount) guardianAccountMapping;

    // to prevent in replay attack, store used sigs
    mapping(string => bool) usedSignatures;

    // new primary address => threshold count
    mapping(address => uint) thresholdSigs;

    constructor(address owner, address primaryAddress) {
        _transferOwnership(owner);
        primaryWallet = primaryAddress;
    }


    function setupSocialRecovery(address[] memory recoveryAddresss, address[] memory guardians) public onlyOwner {
        for (uint i = 0; i< recoveryAddresss.length; i=i+1) {
            addRecoveryAccount(recoveryAddresss[i]);
        }
        for (uint i = 0; i< guardians.length; i=i+1) {
            addGuardian(guardians[i]);
        }
    }

    function addRecoveryAccount(address recoveryAddress) public onlyOwner  {
        RecoveryAccount memory rca = RecoveryAccount(recoveryAddress, true);
        recoveryAccountMapping[recoveryAddress] = rca;
        totalRecoveryAccounts = totalRecoveryAccounts + 1;
        recoveryAddresses.push(recoveryAddress);
    }

    function revokeRecoveryAccount(address recoveryAddress) public onlyOwner  {
        recoveryAccountMapping[recoveryAddress].isActive = false;
    }

    function addGuardian(address guardianAddress) public onlyOwner {
        GuardianAccount memory rca = GuardianAccount(guardianAddress, true);
        guardianAccountMapping[guardianAddress] = rca;
        totalGuardians = totalGuardians + 1;
        guardianAddresses.push(guardianAddress);
    }
    
    function revokeGuardian(address guardianAddress) public onlyOwner {
        guardianAccountMapping[guardianAddress].isActive = false;
    }

    function getGuardians() public view returns(address[] memory) {
        address[] memory guardians = new address[](totalGuardians);
        for (uint i = 0; i < totalGuardians;i= i + 1) {
            address gAddress = guardianAddresses[i];
            if (guardianAccountMapping[gAddress].isActive == true) {
                address guardianAddress = gAddress;
                guardians[i] = guardianAddress;
            }
        }
        return guardians;
    }

    function getRecoveryAccounts() public view returns(address[] memory) {
        address[] memory recoveryAccounts = new address[](totalRecoveryAccounts);
        for (uint i = 0; i < totalRecoveryAccounts;i= i + 1) {
            address rAddress = recoveryAddresses[i];
            if (recoveryAccountMapping[rAddress].isActive == true) {
                recoveryAccounts[i] = rAddress;
            }
        }
        return recoveryAccounts;
    }

    function updateWillAccount(address willAccount) public onlyOwner {
        willAddress = willAccount;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sendEth(address payable _to) public payable onlyOwner {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }


 /**
     * @dev Checks if a signature is valid for a given signer and data hash. If the signer is a smart contract, the
     * signature is validated against that smart contract using ERC1271, otherwise it's validated using `ECDSA.recover`.
     *
     * NOTE: Unlike ECDSA signatures, contract signatures are revocable, and the outcome of this function can thus
     * change through time. It could return true at block N and false at block N+1 (or the opposite).
     */
    function isValidSignatureNow(
        address signer,
        bytes32 hash,
        bytes memory signature
    ) internal view returns (bool) {
        (address recovered, ECDSA.RecoverError error) = ECDSA.tryRecover(hash, signature);
        if (error == ECDSA.RecoverError.NoError && recovered == signer) {
            return true;
        }

        (bool success, bytes memory result) = signer.staticcall(
            abi.encodeWithSelector(IERC1271.isValidSignature.selector, hash, signature)
        );
        return (success &&
            result.length == 32 &&
            abi.decode(result, (bytes32)) == bytes32(IERC1271.isValidSignature.selector));
    }

    function updatePrimaryAccount(bytes memory signature,address newAddress,address signer) external returns(bool) {
        bytes32 hash = keccak256(abi.encodePacked(newAddress));
        require(guardianAccountMapping[signer].isActive == true, "invalid guardian");
        require(recoveryAccountMapping[signer].isActive == true, "invalid recovery address");
        bool isValid = isValidSignatureNow(signer, hash, signature);
        require(isValid == true, "invalid signature");
        thresholdSigs[newAddress] = thresholdSigs[newAddress] + 1;
        if (thresholdSigs[newAddress] >= accountUpdateThreshold) {
            thresholdSigs[newAddress] = 0;
            primaryWallet = newAddress;
            _transferOwnership(newAddress);
            return true;
        }
        return false;
    }

}
