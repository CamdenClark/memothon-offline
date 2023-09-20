import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { StoreProvider } from './StoreProvider.tsx';

// setTimeout(() => worker.select().then((row) => console.log(row)), 1000)


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StoreProvider>
            <App />
        </StoreProvider>
    </React.StrictMode>,
)
