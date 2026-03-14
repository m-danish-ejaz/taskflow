import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function exportIndexedDB(dbName: string) {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(dbName);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const exportData: any = {};

  const tx = db.transaction(db.objectStoreNames, "readonly");

  await Promise.all(
    Array.from(db.objectStoreNames).map((storeName) => {
      return new Promise<void>((resolve) => {
        const store = tx.objectStore(storeName);
        const req = store.getAll();

        req.onsuccess = () => {
          exportData[storeName] = req.result;
          resolve();
        };
      });
    })
  );

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${dbName}-backup.json`;
  a.click();
}

export async function importIndexedDB(dbName: string, data: any) {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(dbName);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const tx = db.transaction(Object.keys(data), "readwrite");

  for (const storeName of Object.keys(data)) {
    const store = tx.objectStore(storeName);

    data[storeName].forEach((item: any) => {
      store.put(item);
    });
  }

  return tx.oncomplete;
}