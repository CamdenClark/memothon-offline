import React from "react";
import ReactDOM from "react-dom/client";
import { StoreProvider } from "./StoreProvider.tsx";

import Router from "./router.tsx";
import "missing.css";
import "missing.css/prism";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <Router />
    </StoreProvider>
  </React.StrictMode>
);
