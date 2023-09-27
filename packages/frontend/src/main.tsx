import React from "react";
import ReactDOM from "react-dom/client";
import { StoreProvider } from "./StoreProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import Router from "./router";
import "missing.css";
import "missing.css/prism";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                <Router />
            </StoreProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
