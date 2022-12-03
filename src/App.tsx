import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Settings from "./pages/Settings";
import { useWeb3Auth, Web3AuthProvider } from "./services/web3auth";

function App() {
  const { provider, login } = useWeb3Auth();
  return (
    <main className="flex flex-col h-screen z-0">
      <Web3AuthProvider>
        {provider ? (
          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route index element={<HomePage />} />
              </Route>
              <Route path="/settings">
                <Route index element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        ) : (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
            <h1 className="text-2xl font-bold text-center sm:text-3xl">Welcome to TrueResQ</h1>
            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">Please connect to Web3Auth to get started.</p>

            <div className="flex-col flex-row mt-10 items-center">
              <div
                onClick={() => {
                  login();
                }}
                className="flex items-center px-4 py-2 mb-2 rounded-lg bg-primary text-white hover:bg-gray-200 hover:text-primary cursor-pointer"
              >
                <span className="text-sm font-bold">Connect to Web3Auth</span>
              </div>
            </div>
          </div>
        )}
      </Web3AuthProvider>
    </main>
  );
}

export default App;
