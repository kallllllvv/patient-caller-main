import './output.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Display from "./pages/Display";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/panel_admin">
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
