import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./Context";
import "react-toastify/dist/ReactToastify.css";

import Home from "./route/Home";
import Dapp from "./route/Dapp";
import Collections from "./route/Collections";
import Mint from "./route/Mint";
import Ordinal from "./route/Ordinal";
import Bounty from "./route/Bounty";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dapp" element={<Dapp />}>
            <Route path="/dapp/collections" element={<Collections />} />
            <Route path="/dapp/mint" element={<Mint />} />
            <Route path="/dapp/ordinal/" element={<Ordinal />} />
            <Route path="/dapp/bounties/" element={<Bounty />} />
          </Route>
        </Routes>
      </AppProvider>
    </div>
  );
}

export default App;
