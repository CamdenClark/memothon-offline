import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { StoreProvider } from './StoreProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import "missing.css"
import "missing.css/prism"

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                <App />
            </StoreProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
