import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app"; // Import the App component (the Router)
import "./style.css";
import { ThemeProvider } from "./components/theme-provider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="udaansathi-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);