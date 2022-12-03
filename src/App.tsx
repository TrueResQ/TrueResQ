import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import AskGuardians from "./pages/AskGuardians";
import GuardianRequests from "./pages/GuardianRequests";
import HomePage from "./pages/HomePage";
import Recovery from "./pages/Recovery";
import RecoveryLogin from "./pages/RecoveryLogin";
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
            <Route path="/guardianRequests">
              <Route index element={<GuardianRequests />} />
            </Route>
            <Route path="/recoveryLogin">
              <Route index element={<RecoveryLogin />} />
            </Route>
            <Route path="/recovery">
              <Route index element={<Recovery />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Web3AuthProvider>
    </div>
  );
}

export default App;
