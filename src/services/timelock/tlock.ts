import { defaultClientInfo, roundForTime, timelockDecrypt, timelockEncrypt } from "tlock-js";
type EncDescResult = {
  plaintext?: string;
  decryptionTime?: number;
  ciphertext: string;
};

async function encrypt(plaintext: string, decryptionTime: number): Promise<EncDescResult> {
  const roundNumber = roundForTime(decryptionTime, defaultClientInfo);
  const ciphertext = await timelockEncrypt(roundNumber, Buffer.from(plaintext));
  return {
    plaintext,
    decryptionTime,
    ciphertext,
  };
}

async function decrypt(ciphertext: string, decryptionTime: number): Promise<EncDescResult> {
  const plaintext = await timelockDecrypt(ciphertext);
  return {
    plaintext,
    decryptionTime,
    ciphertext,
  };
}

export async function encryptedOrDecryptedFormData(params: {
  plainText?: string;
  cipherText?: string;
  decryptionTime: number;
}): Promise<EncDescResult> {
  const { plainText, cipherText, decryptionTime } = params;
  if (plainText) {
    return encrypt(plainText, decryptionTime);
  }
  if (cipherText) {
    return decrypt(cipherText, decryptionTime);
  }

  return Promise.reject(new Error("Neither plaintext nor ciphertext were input"));
}
