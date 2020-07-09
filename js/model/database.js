export class Database {
    constructor() {
        const name = 's5-resources';
        const version = 1;
        this.dbConnection = window.indexedDB.open(name, version);
    }

    open() {
        return new Promise((resolve, reject) => {
            this.dbConnection.onupgradeneeded = event => {
                const db = event.target.result;
                const objectStore = db.createObjectStore('s5-versions', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('version', 'version', { unique: true });
            };
            this.dbConnection.onsuccess = event => {
                this.db = event.target.result;
                resolve(this);
            };
        });
    }

    insert(storeName, data) {
        return new Promise((resolve, reject) => {
            const tran = this.db.transaction(storeName, 'readwrite');
            const store = tran.objectStore(storeName);
            const add = d => store.add(d);
            if (Array.isArray(data)) {
                data.forEach(add);
            }
            else {
                add(data);
            }
            tran.onerror = event => reject(event);
            tran.oncomplete = event => resolve();
        });
    }

    get(storeName, id) {
        return new Promise((resolve, reject) => {
            const tran = this.db.transaction(storeName, 'readonly');
            const store = tran.objectStore(storeName);
            const query = store.get(id);
            query.onerror = event => reject(event);
            query.onsuccess = event => resolve(query.result);
        });
    }

    get(storeName, field, value) {
        return new Promise((resolve, reject) => {
            const tran = this.db.transaction(storeName, 'readonly');
            const store = tran.objectStore(storeName);
            const query = store.getAll();
            query.onerror = event => reject(event);
            query.onsuccess = event => resolve(query.result.find(o => o[field] === value));
        });
    }

    getAll(storeName) {
        return new Promise((resolve, reject) => {
            const tran = this.db.transaction(storeName, 'readonly');
            const store = tran.objectStore(storeName);
            const query = store.getAll();
            query.onerror = event => reject(event);
            query.onsuccess = event => resolve(query.result);
        });
    }
}