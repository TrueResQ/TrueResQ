type GuardianProps = {
  requests: {
    email: string;
    address: string;
    status: string;
    requestId: string;
  }[];
};

const Table = (props: GuardianProps) => {
  return (
    <div className="overflow-hidden overflow-x-auto rounded-lg border border-background">
      <table className="min-w-full divide-y divide-background text-sm">
        <thead className="bg-background">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-100">
              <div className="flex items-center gap-2">
                Requester address
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-100">
              <div className="flex items-center gap-2">
                Requester Email
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-100">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {props.requests.map((request) => {
            return (
              <tr>
                <td className="whitespace-nowrap px-4 py-2 text-gray-300">{request.address}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-300">{request.email}</td>
                <td className="whitespace-nowrap px-4 py-2">
                  {request.status === "pending" ? (
                    <div className="flex-row">
                      <strong
                        style={{ cursor: "pointer" }}
                        className="rounded bg-green-100 mr-5 px-3 py-1.5 text-xs font-medium text-green-700"
                        onClick={() => {
                          // const url = new URL(window.location.href);
                          // url.searchParams.append("requestId", request.requestId);
                          // window.location.href = url.href;
                        }}
                      >
                        Approve
                      </strong>
                    </div>
                  ) : (
                    <div className="flex-row">
                      <strong
                        style={{ cursor: "pointer" }}
                        className="rounded bg-yellow-100 mr-5 px-3 py-1.5 text-xs font-medium text-green-700"
                        onClick={() => {
                          // const url = new URL(window.location.href);
                          // url.searchParams.append("requestId", request.requestId);
                          // window.location.href = url.href;
                        }}
                      >
                        Pending
                      </strong>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
