import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Admin from "./pages/Admin";
import Display from "./pages/Display";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-blue-600 text-white flex gap-4">
        <Link to="/">Admin</Link>
        <Link to="/display">Display</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    </BrowserRouter>
  );
}
