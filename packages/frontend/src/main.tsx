import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { StoreProvider } from './StoreProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import "missing.css"
import "missing.css/prism"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                <RouterProvider router={router} />
            </StoreProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
