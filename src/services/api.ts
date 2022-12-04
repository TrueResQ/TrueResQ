export const apiUrl = "https://9f97-115-110-225-194.ngrok.io";

export const acceptGuardRequest = async (verifier: string, verifier_id: string, executioner_address: string, guardian_email?: string) => {
  try {
    const endPoint = `${apiUrl}/user/guardian_accepted`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = {
      verifier_id,
      verifier,
      accepted: true,
      public_address: executioner_address,
      guardian_email: "",
    };

    if (guardian_email) {
      raw.guardian_email = guardian_email;
    }

    // todo: send a smart contract tx.
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      mode: "cors" as RequestMode,
      redirect: "follow" as RequestRedirect,
    };

    await fetch(endPoint, requestOptions);
  } catch (error) {
    console.log("error while accepting guarding request error");
    throw error;
  }
};

export const updateVerifierId = async (uuid: string, verifier_id: string, guardian_email?: string) => {
  try {
    const endPoint = `${apiUrl}/user/update_verifier_id`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = {
      verifier_id,
      uuid,
      guardian_email,
    };

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      mode: "cors" as RequestMode,
      redirect: "follow" as RequestRedirect,
    };

    await fetch(endPoint, requestOptions);
  } catch (error) {
    console.log("error while accepting guarding request error");
    throw error;
  }
};

export const listExecutionerRequests = async (verifier_id: string) => {
  try {
    const endPoint = `${apiUrl}/user/get_executioners/${verifier_id}`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      mode: "cors" as RequestMode,
      redirect: "follow" as RequestRedirect,
    };

    await fetch(endPoint, requestOptions);
  } catch (error) {
    console.log("error while accepting guarding request error");
    throw error;
  }
};

export const getUser = async (verifier_id: string) => {
  try {
    const endPoint = `${apiUrl}/user/get_executioners/${verifier_id}`;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      mode: "cors" as RequestMode,
      redirect: "follow" as RequestRedirect,
    };

    await fetch(endPoint, requestOptions);
  } catch (error) {
    console.log("error while accepting guarding request error");
    throw error;
  }
};
