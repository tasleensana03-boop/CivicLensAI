import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home        from "./pages/Home";
import Report      from "./pages/Report";
import Dashboard   from "./pages/Dashboard";
import About       from "./pages/About";
import TrackStatus from "./pages/TrackStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />}        />
        <Route path="/report"   element={<Report />}      />
        <Route path="/dashboard"element={<Dashboard />}   />
        <Route path="/about"    element={<About />}       />
        <Route path="/track"    element={<TrackStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
