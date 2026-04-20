import { openDB } from "idb";

const DB_NAME = "offline-db";
const STORE_NAME = "api-queue";

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  },
});

export async function addToQueue(data) {
  const db = await dbPromise;
  await db.add(STORE_NAME, {
    data,
    idempotencyKey: crypto.randomUUID(),
    retries: 0,
    createdAt: Date.now(),
  });
}

export async function getQueue() {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
}

export async function removeFromQueue(id) {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
}

export async function clearQueue() {
  const db = await dbPromise;
  await db.clear(STORE_NAME);
}
