let db;
const request = indexedDB.open("budget", 1);

console.log("console ");
request.onupgradeneeded = function (event) {
  console.log("console check");
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  console.log("console check");
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
  console.log("reading");
};

function saveRecord(record) {
  console.log("console check");

  const transaction = db.transaction(["pending"], "readwrite");

  const store = transaction.objectStore("pending");

  store.add(record);
}

function checkDatabase() {
  console.log("console check");

  console.log("indexeddb working");
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          console.log("console check");

          const transaction = db.transaction(["pending"], "readwrite");

          const store = transaction.objectStore("pending");

          store.clear();
        });
    }
  };
}

window.addEventListener("online", checkDatabase);
