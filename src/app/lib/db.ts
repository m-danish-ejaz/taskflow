const DB_NAME = "taskflow-db";
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {

    if (dbInstance) return Promise.resolve(dbInstance);

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(request.result);
        };
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create tables if they don't exist
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "email" }); // Email as unique ID
            }
            if (!db.objectStoreNames.contains("tasks")) {
                db.createObjectStore("tasks", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("submissions")) {
                db.createObjectStore("submissions", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("campaigns")) {
                db.createObjectStore("campaigns", { keyPath: "id" });
            }
        };
    });
};

// Generic helper to GET a single record
export const getRecord = async (storeName: string, key: string): Promise<any> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Generic helper to ADD/UPDATE a record
export const putRecord = async (storeName: string, data: any): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put(data); // .put() adds or updates if key exists

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

// Generic helper to GET ALL records
export const getAllRecords = async (storeName: string): Promise<any[]> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const delay = (min = 1000, max = 3000) => {
    const time = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, time));
};

export const deleteRecord = async (storeName: string, key: string): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};