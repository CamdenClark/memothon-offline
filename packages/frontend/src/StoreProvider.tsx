import { createContext, useContext, useEffect, useState } from 'react';

import { UseMutationOptions, useMutation, useQuery } from '@tanstack/react-query';

// Initialize the worker
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


export function useQueryHook<T>(queryKey: any, sql: string, bind: any) {
  const { query } = useContext(StoreContext);
  
  return useQuery(queryKey, (): T[] => query(sql, bind));
};

export const useMutationHook = (sql: string, options: UseMutationOptions) => {
  const { query } = useContext(StoreContext);

  return useMutation((bind) => query(sql, bind), options);
};

