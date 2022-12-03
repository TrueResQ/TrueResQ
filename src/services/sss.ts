import sss from "shamirs-secret-sharing";

import { encryptedOrDecryptedFormData } from "./timelock/tlock";

const getTimeLockedShares = (decryptionTime: number) => {
  const secret = Buffer.from("secret key");
  const shares = sss.split(secret, { shares: 10, threshold: 4 });
  const recovered = sss.combine(shares.slice(3, 7));
  console.log(recovered.toString()); // 'secret key'
  const encryptedShares = shares.map((share) => {
    const encShare = encryptedOrDecryptedFormData({ plainText: share, decryptionTime });
    return encShare;
  });
  return encryptedShares;
};

export { getTimeLockedShares };
