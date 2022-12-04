import { decrypt as ecDecrypt, encrypt as ecEncrypt } from "@toruslabs/eccrypto";

interface IMessage {
  ciphertext: string;
  ephemPublicKey: string;
  iv: string;
  mac: string;
}

export async function encrypt(publicKey: Buffer, msg: Buffer): Promise<IMessage> {
  const encryptedDetails = await ecEncrypt(publicKey, msg);

  return {
    ciphertext: encryptedDetails.ciphertext.toString("hex"),
    ephemPublicKey: encryptedDetails.ephemPublicKey.toString("hex"),
    iv: encryptedDetails.iv.toString("hex"),
    mac: encryptedDetails.mac.toString("hex"),
  };
}

export async function decrypt(privKey: Buffer, msg: IMessage): Promise<Buffer> {
  const bufferEncDetails = {
    ciphertext: Buffer.from(msg.ciphertext, "hex"),
    ephemPublicKey: Buffer.from(msg.ephemPublicKey, "hex"),
    iv: Buffer.from(msg.iv, "hex"),
    mac: Buffer.from(msg.mac, "hex"),
  };

  return ecDecrypt(privKey, bufferEncDetails);
}

export function jsonToQuery(url: string, jsonData: Record<string, string>): URL {
  const finalUrl = new URL(url);
  Object.keys(jsonData).forEach((key) => {
    if (jsonData[key]) finalUrl.searchParams.append(key, jsonData[key]);
  });

  return finalUrl;
}

export function jsonToHash(url: string, jsonData: Record<string, string>): string {
  const params = new URLSearchParams();

  Object.keys(jsonData).forEach((key) => {
    if (jsonData[key]) params.append(key, jsonData[key]);
  });
  const finalUrl = `${url}#${params}`;
  return finalUrl;
}

export function queryToJson(url: string): Record<string, string> {
  const finalUrl = new URL(url);
  const { searchParams } = finalUrl;
  const jsonParams: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    jsonParams[key] = decodeURIComponent(val);
  });
  return jsonParams;
}

const _userData = {
  address: "",
  willTime: 0,
  myWillCustodians: [{ address: "", email: "", encryptedShare: "" }],
  willsUnderMe: [{ executioner: "", email: "" }],
};

export const getUserData = (walletAddress: string): Record<string, any> => {
  const userData = localStorage.getItem(walletAddress) || "{}";
  const parsedData = JSON.parse(userData);
  return { ..._userData, ...parsedData };
};

export const setUserData = (walletAddress: string, _data: any) => {
  const userData = localStorage.getItem(walletAddress) || "{}";
  const parsedData = JSON.parse(userData);
  const data = {
    ..._userData,
    ...parsedData,
    ..._data,
  };
  localStorage.setItem(walletAddress, JSON.stringify(data));
};
