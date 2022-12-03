import { timelockDecrypt } from "tlock-js";

type TextContent = { type: "text"; value: string };
type VulnerabilityReportContent = {
  type: "vulnerability_report";
  value: {
    title: string;
    description: string;
    cve?: string;
    file?: File;
  };
};
export type DecryptionContent = TextContent | VulnerabilityReportContent;

export async function decryptMulti(ciphertext: string): Promise<DecryptionContent> {
  const plaintext = await timelockDecrypt(ciphertext);

  return {
    type: "text",
    value: plaintext,
  };
}
