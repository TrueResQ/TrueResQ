import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import AskGuardians from "./pages/AskGuardians";
import HomePage from "./pages/HomePage";
import RecoveryRequests from "./pages/RecoveryRequests";
import Settings from "./pages/Settings";
import { Web3AuthProvider } from "./services/web3auth";

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
            <Route path="/recoveryRequests">
              <Route index element={<RecoveryRequests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Web3AuthProvider>
    </div>
  );
}

export default App;
