import { Route, Routes, Navigate } from "react-router-dom";
import { AppProvider } from "./Context";
import "react-toastify/dist/ReactToastify.css";

import Home from "./route/Home";
import Dapp from "./route/Dapp";
import Collections from "./route/Collections";
import Mint from "./route/Mint";
import Ordinal from "./route/Ordinal";
import Bounty from "./route/Bounty";
import FreeMint from "./route/FreeMint";
import EthBounty from "./route/EthBounty";
import Faq from "./route/Faq";
import Marketplace from "./route/Marketplace";
import Erc721Switch from "./route/Erc721Switch";
import Learning from "./route/Learning";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dapp" element={<Dapp />}>
            <Route index element={<Navigate to="/dapp/collections" />} />
            <Route path="/dapp/collections" element={<Collections />} />
            <Route path="/dapp/mint" element={<Mint />} />
            <Route path="/dapp/ordinal/" element={<Ordinal />} />
            <Route path="/dapp/bounties/" element={<Bounty />}>
              <Route
                index
                element={<Navigate to="/dapp/bounties/freemint" />}
              />
              <Route path="/dapp/bounties/freemint" element={<FreeMint />} />
              <Route path="/dapp/bounties/ethbounty" element={<EthBounty />} />
            </Route>
            <Route path="/dapp/faq" element={<Faq />} />
            <Route path="/dapp/marketplace" element={<Marketplace />} />
            <Route path="/dapp/switch" element={<Erc721Switch />} />
            <Route path="/dapp/learning" element={<Learning />} />
          </Route>
        </Routes>
      </AppProvider>
    </div>
  );
}

export default App;
