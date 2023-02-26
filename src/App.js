import { Route, Routes } from "react-router-dom";
import { AppProvider } from "./Context";

import Home from "./route/Home";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </AppProvider>
    </div>
  );
}

export default App;
