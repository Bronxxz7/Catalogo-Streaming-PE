import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/app.css";
import "./components/Navbar/navbar.css";
import "./components/Sidebar/sidebar.css";
import "./components/Admin/admin.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);