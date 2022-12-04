type WillGuardianProps = {
  requests: {
    guardians: {
      email: string;
      address: string;
    }[];
    timeout: string;
  };
};

const Willtable = (props: WillGuardianProps) => {
  return (
    <>
      {props.requests.timeout !== "0" ? (
        <>
          <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    <div className="flex items-center gap-2">Guardian's addresses</div>
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    <div className="flex items-center gap-2">Guardian's Email</div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {props.requests.guardians.map((request) => {
                  return (
                    <tr>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{request.address}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{request.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="content-start">
            Your WILL will be executed in <span className="text-red-600">{props.requests.timeout} months</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative form-floating mb-3 xl:w-96" data-mdb-toggle-button="false">
              <input
                type="date"
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Select a date"
              />
            </div>
          </div>
          <button className="flex flex-row rounded-full px-6 py-3 text-white cursor-pointer" style={{ backgroundColor: "#599cb3" }}>
            Set a new time
          </button>
        </>
      ) : (
        <>
          <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    <div className="flex items-center gap-2">Guardian's addresses</div>
                  </th>
                  <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                    <div className="flex items-center gap-2">Guardian's Email</div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {props.requests.guardians.map((request) => {
                  return (
                    <tr>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{request.address}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{request.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="content-start text-red-600">Your WILL doesn't have an execution time.</div>
          <div className="flex items-center justify-center">
            <div className="relative form-floating mb-3 xl:w-96" data-mdb-toggle-button="false">
              <input
                type="date"
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Select a date"
              />
            </div>
          </div>
          <button className="flex flex-row rounded-full px-6 py-3 text-white cursor-pointer" style={{ backgroundColor: "#599cb3" }}>
            Set an execution time
          </button>
        </>
      )}
    </>
  );
};

export default Willtable;
