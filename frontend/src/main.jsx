import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuroraBackground } from "./components/ui/aurora-background.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuroraBackground>
      <App />
    </AuroraBackground>
  </React.StrictMode>
);
