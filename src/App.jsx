import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CRM from "./CRM"; // The CRM page

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<CRM />} />  {/* CRM Page Route */}
      </Routes>
    </Router>
  );
}

export default App;
