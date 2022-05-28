
let db;
let openRequest = indexedDB.open("mystorage",3);

openRequest.addEventListener("success", (e) => {
    console.log("Storage success");
    db = openRequest.result;

})

openRequest.addEventListener("error", (e) => {
    console.log("storage denied");
})

openRequest.addEventListener("upgradeneeded" , (e) => {
    console.log("Storage upgraded")
    db = openRequest.result;
    db.createObjectStore("video", {keyPath: "id"});
    db.createObjectStore("image", {keyPath: "id"});

})