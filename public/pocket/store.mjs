let db;
export async function openStore() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open("pocket-local-v1", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("desk");
    r.onsuccess = () => {
      db = r.result;
      db.onversionchange = () => db.close();
      resolve(db);
    };
    r.onerror = () => reject(r.error);
    r.onblocked = () =>
      reject(new Error("Close other Pocket tabs and try again."));
  });
}
export async function readDesk() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("desk", "readonly");
    const r = tx.objectStore("desk").get("current");
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
export async function writeDesk(data, expectedRevision) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("desk", "readwrite");
    const store = tx.objectStore("desk");
    let conflict = false;
    const r = store.get("current");
    r.onsuccess = () => {
      if ((r.result?.revision ?? 0) !== expectedRevision) {
        conflict = true;
        tx.abort();
        return;
      }
      store.put({ data, revision: expectedRevision + 1 }, "current");
    };
    tx.oncomplete = () => resolve(expectedRevision + 1);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () =>
      reject(
        new Error(
          conflict
            ? "Your desk changed in another tab. Reload Pocket before editing; unsaved changes have not replaced anything."
            : "Pocket could not save. Storage may be full or unavailable. Export a backup and free space.",
        ),
      );
  });
}
