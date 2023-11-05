import { createContext, useEffect, useState } from 'react';

import * as Comlink from "comlink";
import QueryWorker from './worker.ts?worker';
import { Card } from './models/Card';

export interface WorkerContextData {
  db: any;
  init: () => Promise<any>;
  query: (sql: string, bind: (string | number)[]) => Promise<any>;
  createCard: (card: Card) => Promise<any>;
  select: () => any;
  cleanup: () => Promise<any>;
}

const worker = Comlink.wrap<WorkerContextData>(new QueryWorker());

export const WorkerContext = createContext<WorkerContextData>(null!);

type StoreProviderProps = {
  children: React.ReactNode;
};

export const WorkerContextProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    worker.init().then(() => setLoading(false));
  }, []);

  return (
    <WorkerContext.Provider value={worker}>
      {!loading && children}
    </WorkerContext.Provider>
  );
};
