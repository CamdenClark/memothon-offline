import React, { createContext, useEffect } from 'react';

import * as Comlink from "comlink";

import QueryWorker from './worker.ts?worker';
export const worker = Comlink.wrap(new QueryWorker());
export const StoreContext = createContext(null);
export const StoreProvider = ({ children }) => {
    useEffect(() => { worker.init(); }, []);

    return (
        <StoreContext.Provider value={{ query: worker.query, cleanup: worker.cleanup }}>
            {children}
        </StoreContext.Provider>
    );
};

