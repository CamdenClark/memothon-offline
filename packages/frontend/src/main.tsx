import React from "react";
import ReactDOM from "react-dom/client";
import { WorkerContextProvider } from "./StoreProvider.tsx";

import Router from "./router.tsx";
import "missing.css";
import "missing.css/prism";

const root = document.getElementById("root")!

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <WorkerContextProvider>
        <Router />
      </WorkerContextProvider>
    </React.StrictMode>
  );
}
