import { createContext, useEffect, useState } from 'react';

import * as Comlink from "comlink";
import QueryWorker from './worker.ts?worker';

export interface StoreContextData {
  query: (sql: string, bind: (string | number)[]) => Promise<any>;
  cleanup: () => Promise<any>;
}

interface WorkerData {
  db: any;
  init: () => Promise<any>;
  query: (sql: string, bind: (string | number)[]) => Promise<any>;
  select: () => any;
  cleanup: () => Promise<any>;
}

export const worker = Comlink.wrap<WorkerData>(new QueryWorker());

// Create a react context for the store
export const StoreContext = createContext<StoreContextData>(null!);

export type StoreProviderProps = {
  children: React.ReactNode;
};

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    worker.init().then(() => setLoading(false));
  }, []);

  return (
    <StoreContext.Provider value={worker}>
      {!loading && children}
    </StoreContext.Provider>
  );
};
