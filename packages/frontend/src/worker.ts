// In `worker.js`.
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

import * as Comlink from "comlink";

const up = `CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    front TEXT,
    back TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    card_id TEXT,
    reviewed_at TEXT,
    due_at TEXT
);
`;

interface WorkerData {
    db: any;
    init: () => Promise<any>;
    query: (sql: string, bind: (string | number)[]) => Promise<any>;
    select: () => any;
    cleanup: () => Promise<any>;
}

const data: WorkerData = {
    db: null,
    async init() {
        const sqlite3 = await sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        });
        console.log('Done initializing. Running demo...');
        try {
            if ('opfs' in sqlite3) {
                this.db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3');
                console.log('OPFS is available, created persisted database at', this.db.filename);
                this.query(up, []);
            } else {
                this.db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');
                console.log('OPFS is not available, created transient database', this.db.filename);
            }
        } catch (err: any) {
            console.error(err.name, err.message);
        }
    },
    query(sql: string, bind: any) {
        if (!this.db) {
            return;
        }
        return this.db.exec({ sql, bind, returnValue: "resultRows", rowMode: "object" });
    },
    select() {
        return this.query("SELECT * from cards", []);
    },
    async cleanup() {
        const opfsRoot = await navigator.storage.getDirectory();
        await opfsRoot.removeEntry("mydb.sqlite3");
        await this.init();
    }
}

Comlink.expose(data);
