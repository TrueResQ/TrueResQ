import { generatePrivate, getPublic } from "@toruslabs/eccrypto";
import sss from "shamirs-secret-sharing";

import { encryptedOrDecryptedFormData } from "./timelock/tlock";

const getPrivateKey = () => {
  return generatePrivate();
};

const getTimeLockedShares = (decryptionTime: number) => {
  const privateKey = getPrivateKey();
  console.log("originla", Buffer.from(privateKey).toString("hex"));
  const shares = sss.split(privateKey, { shares: 3, threshold: 2 });
  const recovered = sss.combine(shares.slice(0, 2));
  console.log(Buffer.from(privateKey).toString("hex")); // 'secret key'
  const encryptedShares = shares.map((share) => {
    console.log("raw share", share.toString("hex"));
    const encShare = encryptedOrDecryptedFormData({ plainText: share.toString("hex"), decryptionTime });
    return encShare;
  });
  return Promise.all(encryptedShares);
};

export { getTimeLockedShares };
