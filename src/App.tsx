import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Settings from "./pages/Settings";
import { useWeb3Auth, Web3AuthProvider } from "./services/web3auth";

function App() {
  return (
    <div>
      <Web3AuthProvider>
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
      </Web3AuthProvider>
    </div>
  );
}

export default App;
