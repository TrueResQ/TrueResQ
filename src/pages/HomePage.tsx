import ConnectWeb3AuthButton from "../components/ConnectWeb3AuthButton";
import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useWeb3Auth } from "../services/web3auth";

function HomePage() {
  const { provider, address, balance, sendTransaction } = useWeb3Auth();
  const formDetails = [
    {
      label: "Address",
      input: address as string,
      readOnly: true,
    },
    {
      label: "Balance",
      input: balance as string,
      readOnly: true,
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      {provider ? (
        <div className="flex flex-col h-screen z-0">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start ">
              <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Welcome to TrueResQ</h1>
              <div className="py-16 w-11/12 ">
                <Form heading="Your Account Details" formDetails={formDetails}>
                  <button
                    className="mt-1 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "#599cb3" }}
                    onClick={() => sendTransaction()}
                  >
                    Send Transaction
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
          <h1 className="text-2xl font-bold text-center sm:text-3xl">Welcome to TrueResQ</h1>
          <p className="max-w-md mx-auto mt-4 text-center text-gray-500">Please connect to Web3Auth to get started.</p>
          <div className="flex-col flex-row mt-10 items-center">
            <ConnectWeb3AuthButton />
          </div>
        </div>
      )}
    </main>
  );
}

export default HomePage;
