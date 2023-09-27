import { createContext, useEffect, useState } from 'react';

import * as Comlink from "comlink";
import QueryWorker from './worker.ts?worker';

interface WorkerData {
    db: any;
    init: () => Promise<any>;
    query: (sql: string, bind: (string | number)[]) => Promise<any>;
    select: () => any;
    cleanup: () => Promise<any>;
}

export const worker = Comlink.wrap<WorkerData>(new QueryWorker());

// Create a react context for the store
export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        worker.init().then(() => setLoading(false));
    }, []);

    return (
        <StoreContext.Provider value={{ query: worker.query, cleanup: worker.cleanup }}>
            {!loading && children}
        </StoreContext.Provider>
    );
};
