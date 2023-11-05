import React from "react";
import ReactDOM from "react-dom/client";
import { WorkerContextProvider } from "./StoreProvider.tsx";

import Router from "./router.tsx";
import "missing.css";
import "missing.css/prism";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WorkerContextProvider>
      <Router />
    </WorkerContextProvider>
  </React.StrictMode>
);
