import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import EditEntry from "./pages/EditEntry";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Sales Management App</h1>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddEntry />} />
        <Route path="/edit/:id" element={<EditEntry />} />
      </Routes>
    </div>
  );
}

export default App;
