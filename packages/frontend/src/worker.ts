// In `worker.js`.
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

import * as Comlink from "comlink";

const up = `CREATE TABLE cards (
    id TEXT PRIMARY KEY,
    front TEXT,
    back TEXT
);
INSERT INTO cards (id, front, back) VALUES ('foo', 'front', 'back');
`;


const data = {
    db: null,
    init() {
        sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        }).then((sqlite3) => {
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
            } catch (err) {
                console.error(err.name, err.message);
            }
        });
    },
    query(sql: string, bind: any) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject();
                return;
            }
            this.db.exec({ sql, bind, rowMode: "object", callback: resolve });
        });
    },
    select() {
        return this.query("SELECT * from cards", [])
    },
    async cleanup() {
        const opfsRoot = await navigator.storage.getDirectory();
        await opfsRoot.removeEntry("mydb.sqlite3");
    }
}

Comlink.expose(data);
